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
  let member = await status.FetchMember(msg.author.id)

  // クランメンバーでなければ終了
  if (!member) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  // 3凸していた場合は終了
  if (member.end === '1') {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 3凸目の処理を実行
  let result: boolean
  ;[result, member] = await threeConvexProcess(member, msg)
  // 3凸終了済みの場合は終了
  if (result) return '3 Convex is finished'

  // 持越がないのに持越凸しようとした場合は終了
  if (member.carry && !/[1-3]/.test(String(member.over))) {
    msg.reply('持越がないのに持越凸になってるわ')
    return 'Not carry over'
  }

  // 凸宣言しているボスの番号を取得
  const alpha = member.declare as Option<AtoE>

  // 凸宣言してない場合は終了
  if (!alpha) {
    msg.reply('凸報告の前に凸宣言をしてね')
    return 'Not declared convex'
  }

  // ボス更新前の状態を取得
  let state = await current.Fetch()

  // 既にボスが討伐されてりる場合は終了
  if (state[alpha].subjugate) {
    msg.reply(`${state[alpha].name}はもう討伐されてるわ`)
    return 'The boss has already been subdued'
  }

  // 全角を半角に変換
  let content = util.Format(msg.content)

  // 凸宣言を完了
  await react.ConvexDone(alpha, msg.author)

  // ボスを倒したか確認
  if (/^k|kill|きっl/i.test(content)) {
    // ボスのHPを0にする
    state = await declareStatus.RemainingHPChange('@0', alpha, state)
  } else if (/@\d/.test(content)) {
    // @が入っている場合はHPの変更をする
    state = await declareStatus.RemainingHPChange(content, alpha, state)
  }

  // @0が入力された場合は、killを追加する
  if (/@0/.test(content)) {
    content = 'kill' + content
  }

  // 持越がある場合、持越状況のメッセージを全て削除
  await overDelete(member, msg)

  // 凸報告者の凸宣言に書いてあるメッセージを全て削除
  await declareStatus.UserMessageAllDelete(member)

  // 凸状況を更新
  let members: Member[]
  ;[members, member] = await update.Status(member, msg, content)
  if (!member) return
  await util.Sleep(100)

  // 凸状況をスプレッドシートに反映
  status.ReflectOnSheet(member)

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    cancel.Remove(alpha, msg.author.id)
  }

  // 3凸終了している場合
  if (member.end) {
    await msg.member?.roles.remove(Settings.ROLE_ID.PLAN_CONVEX)
  }

  // #凸状況を更新
  situation.Report(members, state)
  list.SituationEdit()

  // 凸宣言の状況を更新
  declare.SetPlanList(alpha, state)

  // 活動限界時間の表示を更新
  limitTime.Display(members)

  // 離席中ロールを削除
  await msg.member?.roles.remove(Settings.ROLE_ID.AWAY_IN)

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
    member = await update.ConvexEndProcess(member, msg)

    // 凸状況をスプレッドシートに反映
    status.ReflectOnSheet(member)

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
    await over.AllDelete(msg.member)
  } else if (/[2-3]/.test(String(member.over))) {
    // #進行-連携のチャンネルを取得
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

    // #進行-連携に#持越状況を整理するように催促する
    await channel.send(`<@!${member.id}> <#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> を整理してね`)
  }
}
