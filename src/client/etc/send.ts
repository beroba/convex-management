import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

export const Emoji = (msg: Discord.Message) => {
  // 草野優衣の絵文字を押す
  yuiKusano(msg)
}

/**
 * 送信されたメッセージに草野またはユイの文字が入っていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
const yuiKusano = (msg: Discord.Message): Option<string> => {
  // 草野かユイの文字が入っているか確認
  const match = msg.content.replace(/草|優衣|くさ|ゆい/g, 'ユイ').match(/ユイ/)

  // 入っていない場合は終了、入っている場合は草野優衣の絵文字をつける
  if (!match) return
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  console.log('React Yui Kusano')
}

/**
 * 送信されたメッセージにorが入っていた場合どれかを乱数で返す
 * @param msg DiscordからのMessage
 * @return orが入っていたかの結果
 */
export const AorB = (msg: Discord.Message): Option<string> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.SEND_IMAGE_CHANNEL, msg.channel)) return

  // orが入っている最初の行を取得
  const content = msg.content.split('\n').find(s => /^.+or.+$/i.test(s))

  // orがなければ終了
  if (!content) return

  // orで区切ったリストを作る
  const list = content
    .replace('OR', 'or')
    .split('or')
    .map(s => s.trim())

  // リストの数に応じて乱数を作る
  const rand = createRandNumber(list.length)

  // メッセージ送信先のチャンネルを取得
  const channel = util.GetTextChannel(msg.channel.id)
  channel.send(list[rand])

  return 'Returned any of or'
}

/**
 * 引数に渡された整数の範囲で乱数を生成する
 * @param n 乱数の生成範囲
 * @return 乱数
 */
const createRandNumber = (n: number): number => require('get-random-values')(new Uint8Array(1))[0] % n

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
