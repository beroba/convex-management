import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionAdd = (react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  // クランのサーバーでなければ終了
  if (react.message.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // プレイヤーid送信ロールの付与を行う
  comment = playerIDRoleGrant(react, user as Discord.User)
  if (comment) return console.log(comment)
}

/**
 * #id送信ロール付与いリアクションしたユーザーに、idスクショ送信のロールを付与する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール付与の実行結果
 */
const playerIDRoleGrant = (react: Discord.MessageReaction, user: Discord.User): Option<string> => {
  // #id送信ロール付与でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.PLAYER_ID_ROLE_GRANT) return

  // idスクショ送信のロールを付与する
  const member = react.message.guild?.members.cache.map(m => m).filter(m => m.user.id === user.id)[0]
  member?.roles.add(Settings.ROLE_ID.PLAYER_ID_SEND)

  return 'Grant player id send role'
}
