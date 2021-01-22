import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as report from './report/cancel'
import * as plan from './plan/delete'
import * as over from './convex/over'
import * as sister from './convex/sister'
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

  // プレイヤーid送信ロールの付与を行う
  comment = await playerID.RoleGrant(react, user as Discord.User)
  if (comment) return console.log(comment)
}
