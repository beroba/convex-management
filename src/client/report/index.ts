import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import {AtoE, Member} from '../../io/type'
import * as update from './update'
import * as limitTime from '../convex/limitTime'
import * as over from '../convex/over'
import * as situation from '../convex/situation'
import * as declare from '../declare'
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
  let oldMember = await status.FetchMember(msg.author.id)

  // クランメンバーでなければ終了
  if (!oldMember) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  // 3凸していた場合は終了
  if (oldMember.end === '1') {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 3凸目の処理を実行
  let result: boolean
  ;[result, oldMember] = await threeConvexProcess(oldMember, msg)
  // 3凸終了済みの場合は終了
  if (result) return '3 Convex is finished'

  // 持越がないのに持越凸しようとした場合は終了
  if (oldMember.carry && !/[1-3]/.test(String(oldMember.over))) {
    msg.reply('持越がないのに持越凸になってるわ')
    return 'Not carry over'
  }

  // 凸宣言しているボスの番号を取得
  const alpha = oldMember.declare as Option<AtoE>

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
  let members: Member[], newMember: Option<Member>
  ;[members, newMember] = await update.Status(oldMember, msg, content)

  // ボス更新前の状態を取得
  let state = await current.Fetch()

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    state = await declareStatus.RemainingHPChange(content, alpha, state)
  }

  // 凸状況が更新できていない場合は終了
  if (!newMember) return

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    // 凸予定を削除
    cancel.Remove(alpha, msg.author.id)

    // 凸宣言の予定を更新する
    list.SituationEdit()
  }

  // 凸状況を更新
  situation.Report(members, state)

  // 凸宣言者を更新
  react.ConvexDone(alpha, msg.author)

  // 凸宣言の予定を更新
  declare.SetPlanList(alpha, state)

  // 持越がある場合、持越状況のメッセージを全て削除
  overDelete(oldMember, msg)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // ロールを削除する
  roleDelete(newMember, msg)

  // 活動限界時間の表示を更新
  limitTime.Display(members)

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
    member.end = '1'
    // ステータスを更新
    const members = await status.UpdateMember(member)

    // 何人目の3凸終了者なのかを報告する
    const n = members.filter(s => s.end === '1').length + 1
    await msg.reply(`残凸数: 0、持越数: 0\n\`${n}\`人目の3凸終了よ！`)

    return [true, member]
  }

  // 持越凸状態に変更
  member.carry = true

  return [false, member]
}

/**
 * 持越が1つの場合、持越状況のメッセージを全て削除する
 * 持越が2-3つの場合、#進行-連携に#持越状況を整理するように催促する
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 */
const overDelete = async (member: Member, msg: Discord.Message) => {
  // 持越凸でない場合は終了
  if (!member.carry) return

  // 持越が1つ、2-3つの場合で処理を分ける
  if (member.over === 1) {
    // 持越を持っている人のメッセージを削除
    over.AllDelete(msg.member)
  } else if (/[2-3]/.test(String(member.over))) {
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
    // 凸残ロールを削除
    msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
    // 凸予定ロールを削除
    msg.member?.roles.remove(Settings.ROLE_ID.PLAN_CONVEX)
  }
}
