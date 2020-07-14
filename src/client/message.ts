import * as Discord from 'discord.js'
import Option from 'type-of-option'
import throwEnv from 'throw-env'
import Settings from 'const-settings'

/**
 * 入力されたメッセージに応じて適切なコマンドを実行する
 * @param msg DiscordからのMessage
 */
export const Message = (msg: Discord.Message) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== throwEnv('CLAN_SERVER_ID')) return

  let comment: Option<string>

  // ヤバイの文字がある場合の処理
  comment = SendYabaiImage(msg)
  if (comment) return console.log(comment)
}

/**
 * 送信されたメッセージにヤバイの文字が入っていた場合、ヤバイわよ！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const SendYabaiImage = (msg: Discord.Message): Option<string> => {
  // ヤバイの文字が入っているか確認
  const match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/)

  // 入っていない場合は終了、入っている場合はヤバイわよ！の画像を送信
  if (!match) return

  msg.channel.send('', {files: [Settings.URL.YABAIWAYO]})
  return 'Send Yabai Image'
}