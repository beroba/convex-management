import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as plan from '../convex/plan/delete'
import * as report from '../convex/report/cancel'

/**
 * メッセージ削除のイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param msg DiscordからのMessage
 */
export const MessageDelete = async (msg: Discord.Message | Discord.PartialMessage) => {
  const isBeroba = msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  let comment: Option<string>
  msg = msg as Discord.Message

  comment = await report.Delete(msg)
  if (comment) return console.log(comment)

  comment = await plan.Delete(msg)
  if (comment) return console.log(comment)
}
