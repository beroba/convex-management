import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import {AtoE, Current, Member} from '../../io/type'
import * as update from './update'
import * as role from '../convex/role'
import * as time from '../convex/time/time'
import * as over from '../convex/over'
import * as situation from '../convex/situation'
import * as declare from '../declare/list'
import * as declareStatus from '../declare/status'
import * as react from '../declare/react'
import * as cancel from '../plan/delete'
import * as list from '../plan/list'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // メンバーの状態を取得
  let member_1 = await status.FetchMember(msg.author.id)

  // クランメンバーでなければ終了
  if (!member_1) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  // 3凸していた場合は終了
  if (member_1.end) {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 3凸目の処理を実行
  let result: boolean
  ;[result, member_1] = await threeConvexProcess(member_1, msg)
  // 3凸終了済みの場合は終了
  if (result) return '3 Convex is finished'

  // 持越がないのに持越凸しようとした場合は終了
  if (member_1.carry && !/[1-3]/.test(member_1.over.to_s())) {
    msg.reply('持越がないのに持越凸になってるわ')
    return 'Not carry over'
  }

  // 持越か否かの真偽値
  const carry = member_1.carry

  // 凸宣言しているボスの番号を取得
  const alpha = <Option<AtoE>>member_1.declare

  // 凸宣言してない場合は終了
  if (!alpha) {
    msg.reply('凸報告の前に凸宣言をしてね')
    return 'Not declared convex'
  }

  // 全角を半角に変換
  let content = util.Format(msg.content)

  // killが入力された場合は、`@\d`を`0`にする
  if (/^k|kill|きっl/i.test(content)) {
    content = `${content.replace(/@\d*/, '')}@0`
  }

  // 凸状況を更新
  let members: Member[], member_2: Option<Member>
  ;[members, member_2] = await update.Status(member_1, content)

  // 凸状況が更新できていない場合は終了
  if (!member_2) return

  // ボス更新前の状況を取得
  let state = await current.Fetch()

  // 残りの凸状況を報告
  peportConfirm(members, member_2, state, alpha, content, msg)

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    state = await declareStatus.RemainingHPChange(content, alpha, state)
  }

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    // 凸予定を削除
    cancel.Remove(alpha, msg.author.id)

    // 凸宣言の予定を更新する
    list.SituationEdit()
  }

  // 3凸終了している場合、持越を全て削除
  if (member_2.end) {
    // 持越を持っている人のメッセージを削除
    over.DeleteMsg(msg.member)
  }

  // 凸状況を更新
  situation.Report(members, state)

  // 凸宣言者を更新
  react.ConvexDone(alpha, msg.author)

  // 凸宣言の予定を更新
  declare.SetPlan(alpha, state)

  // 持越がある場合、持越状況のメッセージを全て削除
  overDelete(member_2, carry, msg)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // ロールを削除する
  roleDelete(member_2, msg)

  // 活動限界時間の表示を更新
  time.Display(members)

  return 'Update status'
}

/**
 * 3凸目で持越がない場合は凸を終了状態に変更する。
 * そうでない場合は持越凸状態にする
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 * @return 凸が終わっているかの真偽値とメンバーの状態
 */
const threeConvexProcess = async (member: Member, msg: Discord.Message): Promise<[boolean, Member]> => {
  // 3凸目でない場合は終了
  if (member.convex !== 0) return [false, member]

  // 既に凸が終わっていた場合
  if (member.over === 0) {
    member.end = true
    // ステータスを更新
    const members = await status.UpdateMember(member)

    // 何人目の3凸終了者なのかを報告する
    const n = members.filter(s => s.end).length + 1
    await msg.reply(`残凸数: 0、持越数: 0\n\`${n}\`人目の3凸終了よ！`)

    return [true, member]
  }

  // 持越凸状態に変更
  member.carry = true

  return [false, member]
}

/**
 * 残りの凸状況を報告する
 * @param members メンバー全員の状態
 * @param member メンバーの状態
 * @param state 現在の状況
 * @param alpha ボスの番号
 * @param content 凸報告のメッセージ
 * @param msg DiscordからのMessage
 */
const peportConfirm = (
  members: Member[],
  member: Member,
  state: Current,
  alpha: AtoE,
  content: string,
  msg: Discord.Message
) => {
  const boss = state[alpha]

  // 凸報告のメッセージからHPを取得
  let hp: Option<number | string> = content
    .replace(/^.*@/g, '')
    .trim()
    .replace(/\s.*$/g, '')
    .match(/\d*/)
    ?.map(e => e)
    .first()
  hp = hp === '' || hp === undefined ? boss.hp : hp
  const maxHP = Settings.STAGE[state.stage].HP[alpha]

  // 何人3凸終了しているか確認
  const endN = members.filter(s => s.end).length

  // prettier-ignore
  const text = [
    '```m',
    `${boss.lap}周目 ${boss.name} ${hp}/${maxHP}`,
    `残凸数: ${member.convex}、持越数: ${member.over}`,
    member.end ?
      `${endN}人目の3凸終了よ！` + '\n```' :
      '```',
  ].join('\n')

  msg.reply(text)
}

/**
 * 持越が0の場合、持越状況のメッセージを全て削除する
 * 持越が1-2の場合、#進行-連携に#持越状況を整理するように催促する
 * @param member メンバーの状態
 * @param carry 持越か否かの真偽値
 * @param msg DiscordからのMessage
 */
const overDelete = (member: Member, carry: boolean, msg: Discord.Message) => {
  // 持越凸でない場合は終了
  if (!carry) return

  // 持越が1つ、2-3つの場合で処理を分ける
  if (member.over === 0) {
    // 持越を持っている人のメッセージを削除
    over.DeleteMsg(msg.member)
  } else if (/[1-2]/.test(member.over.to_s())) {
    // #進行-連携のチャンネルを取得
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

    // #進行-連携に#持越状況を整理するように催促する
    channel.send(`<@!${member.id}> <#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> を整理してね`)
  }
}

/**
 * 不要になったロールを削除する
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 */
const roleDelete = (member: Member, msg: Discord.Message) => {
  // 離席中ロールを削除
  msg.member?.roles.remove(Settings.ROLE_ID.AWAY_IN)

  // 3凸終了済みの場合
  if (member.end) {
    // ロールを削除
    msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
    role.RemoveBossRole(msg.member)
  }
}
