import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as declare from './declare/react'
import * as activityTime from './convex/activityTime'
import * as limitTime from './convex/limitTime'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionRemove = async (
  react: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser
) => {
  // クランのサーバーでなければ終了
  if (react.message.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // 凸宣言を行う
  comment = await declare.ConvexRemove(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 通知キャンセルを行う
  comment = await declare.NoticeCancel(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 活動限界時間の設定を行う
  comment = await limitTime.Remove(react, user as Discord.User)
  if (comment) return console.log(comment)

  // 活動時間の削除を行う
  comment = await activityTime.Remove(react, user as Discord.User)
  if (comment) return console.log(comment)
}
