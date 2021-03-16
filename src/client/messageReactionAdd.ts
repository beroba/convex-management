import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as activityTime from './convex/activityTime'
import * as attendance from './convex/attendance'
import * as limitTime from './convex/limitTime'
import * as over from './convex/over'
import * as sister from './convex/sister'
import * as plan from './plan/delete'
import * as report from './report/cancel'
import * as declare from './declare/react'
import * as playerID from './etc/playerID'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionAdd = async (react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  // クランのサーバーでなければ終了
  if (react.message.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // 凸宣言を行う
  comment = await declare.ConvexAdd(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 確定通知を行う
  comment = await declare.ConfirmNotice(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 持越通知を行う
  comment = await declare.OverNotice(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 凸報告を取り消しを行う
  comment = await report.Cancel(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 凸予定を削除を行う
  comment = await plan.Already(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 持ち越し状況の削除を行う
  comment = await over.Delete(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 持ち越し凸先の削除を行う
  comment = await sister.Delete(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 活動限界時間の設定を行う
  comment = await limitTime.Toggle(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 活動時間の追加を行う
  comment = await activityTime.Add(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 離席中ロールの削除を行う
  comment = await attendance.Remove(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 離席中ロールの付与を行う
  comment = await attendance.Add(react, user as Discord.User)
  if (comment) return console.log(comment)

  // プレイヤーid送信ロールの付与を行う
  comment = await playerID.RoleGrant(react, user as Discord.User)
  if (comment) return console.log(comment)
}
