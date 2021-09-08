import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as declare from '../declare'
import * as declareList from '../declare/list'
import * as declareStatus from '../declare/status'
import * as over from '../over'
import * as cancel from '../plan/delete'
import * as list from '../plan/list'
import * as role from '../role'
import * as situation from '../situation'
import * as limit from '../time/limit'
import * as update from './update'
import * as util from '../../util'
import {AtoE, Current, Member} from '../../util/type'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_REPORT
  if (!isChannel) return

  let member_1 = await status.FetchMember(msg.author.id)
  if (!member_1) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  if (member_1.end) {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 3凸目の処理を実行
  let result: boolean
  ;[result, member_1] = await threeConvexProcess(member_1, msg)
  if (result) return '3 Convex is finished'

  // 持越がないのに持越凸しようとした場合
  if (member_1.carry && !/[1-3]/.test(member_1.over.to_s())) {
    msg.reply('持越がないのに持越凸になってるわ')
    return 'Not carry over'
  }

  const carry = member_1.carry
  const alpha = <Option<AtoE>>member_1.declare

  if (!alpha) {
    msg.reply('凸報告の前に凸宣言をしてね')
    return 'Not declared convex'
  }

  let content = util.Format(msg.content)

  const isKill = /^k|kill|きっl/i.test(content)
  if (isKill) {
    // killが入力された場合、`@\d`を`0`に変更
    content = `${content.replace(/@\d*/, '')}@0`
  }

  // 凸状況を更新
  let members: Member[], member_2: Option<Member>
  ;[members, member_2] = await update.Status(member_1, content)
  if (!member_2) return

  let state = await current.Fetch()

  peportConfirm(members, member_2, state, alpha, content, msg)

  // @が入っている場合、HPの変更
  if (/@\d/.test(content)) {
    state = await declareStatus.RemainingHPChange(content, alpha, state)
  }

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    cancel.Remove(alpha, msg.author.id)
    list.SituationEdit()
  }

  // 3凸終了している場合、持越を全て削除
  if (member_2.end) {
    over.DeleteMsg(msg.member)
  }

  situation.Report(members, state)
  declare.Done(alpha, msg.author)
  declareList.SetPlan(alpha, state)

  overDelete(member_2, carry, msg)

  msg.react(Settings.EMOJI_ID.TORIKESHI)
  roleDelete(member_2, msg)

  limit.Display(members)

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
    const members = await status.UpdateMember(member)

    const n = members.filter(s => s.end).length + 1
    await msg.reply(`残凸数: 0、持越数: 0\n\`${n}\`人目の3凸終了よ！`)

    return [true, member]
  }

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
    member.end ? `${endN}人目の3凸終了よ！` : '',
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
    over.DeleteMsg(msg.member)
  } else if (/[1-2]/.test(member.over.to_s())) {
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
    channel.send(`<@!${member.id}> <#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> を整理してね`)
  }
}

/**
 * 不要になったロールを削除する
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 */
const roleDelete = (member: Member, msg: Discord.Message) => {
  msg.member?.roles.remove(Settings.ROLE_ID.ATTENDANCE)

  if (member.end) {
    msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
    role.RemoveBossRole(msg.member)
  }
}
