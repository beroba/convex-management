import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import * as util from '../util'
import {Command} from './command'
import {ConvexReport} from './convex/report'

/**
 * 入力されたメッセージに応じて適切なコマンドを実行する
 * @param msg DiscordからのMessage
 */
export const Message = async (msg: Discord.Message) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  // `/`から始まるコマンドの処理
  if (msg.content.charAt(0) === '/') return Command(msg)

  let comment: Option<string>

  // 凸報告の処理を行う
  comment = await ConvexReport(msg)
  if (comment) return console.log(comment)

  // ヤバイの文字がある場合に画像を送信
  comment = sendYabaiImage(msg)
  if (comment) return console.log(comment)

  // ユイの文字がある場合にスタンプをつける
  comment = sendYuiKusano(msg)
  if (comment) return console.log(comment)
}

/**
 * 送信されたメッセージにヤバイの文字が入っていた場合、ヤバイわよ！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const sendYabaiImage = (msg: Discord.Message): Option<string> => {
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
 * 送信されたメッセージに草野またはユイの文字が入っていた場合、草野優衣のスタンプをつける
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
const sendYuiKusano = (msg: Discord.Message): Option<string> => {
  // 草野かユイの文字が入っているか確認
  const match = msg.content.replace(/草|優衣/g, 'ユイ').match(/ユイ/)

  // 入っていない場合は終了、入っている場合は草野優衣のスタンプを押す
  if (!match) return

  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  return 'Send Yui Kusano'
}
