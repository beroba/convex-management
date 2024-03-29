import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as over from '../convex/over'
import * as plan from '../convex/plan/edit'

/**
 * メッセージ更新のイベントに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const MessageUpdate = async (msg: Discord.Message | Discord.PartialMessage) => {
  const isBeroba = msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  let comment: Option<string>
  msg = msg as Discord.Message

  comment = await plan.Message(msg)
  if (comment) return console.log(comment)

  comment = await over.Edit(msg)
  if (comment) return console.log(comment)
}
