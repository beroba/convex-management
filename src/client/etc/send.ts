import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 送信されたメッセージにヤバイの文字が入っていた場合、ヤバイわよ！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const YabaiImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.SEND_IMAGE_CHANNEL, msg.channel)) return

  // ヤバイの文字が入っているか確認
  const match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/)

  // 入っていない場合は終了、入っている場合はヤバイわよ！の画像を送信
  if (!match) return

  msg.channel.send('', {files: [Settings.URL.YABAIWAYO]})

  return 'Send Yabai Image'
}

/**
 * 送信されたメッセージに草野またはユイの文字が入っていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const YuiKusano = (msg: Discord.Message): Option<string> => {
  // 草野かユイの文字が入っているか確認
  const match = msg.content.replace(/草|優衣/g, 'ユイ').match(/ユイ/)

  // 入っていない場合は終了、入っている場合は草野優衣の絵文字をつける
  if (!match) return
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  return 'React Yui Kusano'
}
