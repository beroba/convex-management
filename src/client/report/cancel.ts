import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'
import {Member} from '../../io/type'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as situation from '../convex/situation'

/**
 * 凸報告を取り消す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const Cancel = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸報告でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.TORIKESHI) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_REPORT)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // メンバーの状態を取得
  const member = await status.FetchMember(react.message.author.id)
  // クランメンバーでなければ終了
  if (!member) return

  // 凸状況を元に戻す
  const members = await statusRestore(react.message)
  // 失敗したら終了
  if (!members) return

  // 凸状況に報告
  situation.Report(members)

  return 'Convex cancellation'
}

/**
 * 凸報告を取り消す
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // メンバーの状態を取得
  const member = await status.FetchMember(msg.author.id)
  // クランメンバーでなければ終了
  if (!member) return

  // 凸状況を元に戻す
  const members = await statusRestore(msg)
  // 失敗したら終了
  if (!members) return

  // 凸状況に報告
  situation.Report(members)

  return 'Convex cancellation'
}

/**
 * 凸状況を元に戻す
 * @param msg DiscordからのMessage
 * @param user リアクションしたユーザー
 * @return メンバー一覧
 */
const statusRestore = async (msg: Discord.Message): Promise<Option<Member[]>> => {
  // メンバーの状態を取得
  let member = await status.FetchMember(msg.author.id)
  if (!member) return

  // 2回キャンセルしてないか確認
  const result = confirmCancelTwice(member)
  // キャンセルしていた場合は終了
  if (result) return

  // 凸状況を1つ前に戻す
  member = rollback(member)

  // 3凸時の処理
  if (member.end) {
    member = endConfirm(member, msg)
  }

  // 凸報告に凸状況を報告
  const convex = member.convex ? `${member.convex}凸目 ${member.over ? '持ち越し' : '終了'}` : '未凸'
  msg.reply(`取消を行ったわよ\n${convex}`)

  // ボス倒していたかを判別
  killConfirm(msg)

  // ステータスを更新
  const members = await status.UpdateMember(member)
  await util.Sleep(100)

  // 凸状況をスプレッドシートに反映
  status.ReflectOnSheet(member)

  return members
}

/**
 * 2回キャンセルしてないか確認
 * @param member 確認するメンバー
 * @return 2回キャンセルしていたかの真偽値
 */
const confirmCancelTwice = (member: Member): boolean => {
  return `${member.convex}${member.over ? '+' : ''}` === member.history
}

/**
 * 凸状況を1つ前に戻す
 * @param member 更新するメンバー
 * @return 更新したメンバー
 */
const rollback = (member: Member): Member => {
  member.convex = member.history[0] ? member.history[0] : ''
  member.over = member.history.length === 2 ? '1' : ''
  return member
}

/**
 * 3凸目の取消の場合に凸残ロールを付与する
 * @param member 更新するメンバー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
const endConfirm = (member: Member, msg: Discord.Message): Member => {
  // 3凸終了のフラグを折る
  member.end = ''
  // 凸残ロールを付与する
  msg.member?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)

  return member
}

/**
 * ボスを倒していた場合、前のボスに戻す
 * @param msg DiscordからのMessage
 */
const killConfirm = (msg: Discord.Message) => {
  const content = util.Format(msg.content)
  // ボスを倒していなければ終了
  if (!/^k|kill/i.test(content)) return

  // 前のボスに戻す
  lapAndBoss.Previous()
}
