import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionRemove = async (
  react: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser
) => {
  const isBeroba = react.message.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  let comment: Option<string>
  user = user as Discord.User
  comment
}
