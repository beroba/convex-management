import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as playerID from './etc/playerID'
import {Cancel} from './convex/cancel'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionAdd = async (react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  // クランのサーバーでなければ終了
  if (react.message.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // プレイヤーid送信ロールの付与を行う
  comment = await Cancel(react, user as Discord.User)
  if (comment) return console.log(comment)

  // プレイヤーid送信ロールの付与を行う
  comment = playerID.RoleGrant(react, user as Discord.User)
  if (comment) return console.log(comment)
}
