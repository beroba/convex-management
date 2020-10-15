import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as update from './plan/update'

/**
 * メッセージ更新のイベントに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const MessageUpdate = async (msg: Discord.Message | Discord.PartialMessage) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // 凸報告を取り消しを行う
  comment = await update.Message(msg as Discord.Message)
  if (comment) return console.log(comment)
}
