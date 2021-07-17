import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as declare from './declare/status'
import * as edit from './plan/edit'
import * as queue from '../util/queue'

/**
 * メッセージ更新のイベントに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const MessageUpdate = async (msg: Discord.Message | Discord.PartialMessage) => {
  queue.Push(messageUpdate, msg)
}

/**
 * メッセージ更新のイベントに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
const messageUpdate = async (msg: Discord.Message | Discord.PartialMessage) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // 凸宣言のメッセージ編集を行う
  comment = await declare.Edit(msg as Discord.Message)
  if (comment) return console.log(comment)

  // 凸報告を取り消しを行う
  comment = await edit.Message(msg as Discord.Message)
  if (comment) return console.log(comment)
}
