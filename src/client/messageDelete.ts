import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as report from './report/cancel'
import * as plan from './plan/cancel'

/**
 * メッセージ削除のイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param msg DiscordからのMessage
 */
export const MessageDelete = async (msg: Discord.Message | Discord.PartialMessage) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // 凸報告を取り消しを行う
  comment = await report.Delete(msg as Discord.Message)
  if (comment) return console.log(comment)

  // 凸予定を削除を行う
  comment = await plan.Delete(msg as Discord.Message)
  if (comment) return console.log(comment)
}
