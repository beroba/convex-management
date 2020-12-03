import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 特定のメッセージに絵文字を付ける
 * @param msg DiscordからのMessage
 */
export const Emoji = (msg: Discord.Message) => {
  // 草野優衣の絵文字を押す
  yuiKusano(msg)
  // まざらしの絵文字を押す
  mazarashi(msg)
  // うさまるの絵文字を押す
  usamaru(msg)
}

/**
 * 送信されたメッセージにユイっぽい文字が入っていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 */
const yuiKusano = (msg: Discord.Message) => {
  // ユイっぽい文字が入っているか確認
  const match = msg.content.replace(/草|優衣|くさ|ゆい|715020255059247146/g, 'ユイ').match(/ユイ/)

  // 入っていない場合は終了
  if (!match) return

  // 草野優衣の絵文字をつける
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  console.log('React Yui Kusano')
}

/**
 * 送信されたメッセージにまざらしっぽいの文字が入っていた場合、まざらしの絵文字をつける
 * @param msg DiscordからのMessage
 */
const mazarashi = (msg: Discord.Message) => {
  // まざらしっぽい文字が入っているか確認
  const match = msg.content.replace(/まざ|厚着|下着|冷凍|341239349997993984|722547140487938181/g, 'らし').match(/らし/)

  // 入っていない場合は終了
  if (!match) return

  // まざらしの絵文字をつける
  msg.react(Settings.EMOJI_ID.MAZARASHI)

  console.log('React Mazarashi')
}

/**
 * 送信されたメッセージにうさまるっぽい文字が入っていた場合、うさまるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const usamaru = (msg: Discord.Message) => {
  // うさまるっぽい文字が入っているか確認
  const match = msg.content.replace(/うさ|レジ|ギガス|ｷﾞｶﾞ|兎丸|usamaru|652747597739589632/g, 'まる').match(/まる/)

  // 入っていない場合は終了
  if (!match) return

  // うさまるの絵文字をつける
  msg.react(Settings.EMOJI_ID.USAMARU)

  console.log('React Usamaru')
}

/**
 * 送信されたメッセージの先頭におはなしが入っている場合、キャルが喋る
 * @param msg DiscordからのMessage
 * @return おはなしの結果
 */
export const Speak = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // 漢字でも動くようにする
  const adjustment = msg.content.replace(/お話し|お話/, 'おはなし')

  // おはなしが先頭じゃない場合は終了
  const match = adjustment.match(/^おはなし /)
  if (!match) return

  // 送信者のメッセージを削除する
  setTimeout(() => msg.delete(), 500)

  // メッセージからおはなしを省く
  const content = adjustment.replace('おはなし ', '')

  // メッセージ送信先のチャンネルを取得
  const channel = util.GetTextChannel(msg.channel.id)
  channel.send(content)

  // 誰が送信したかロをを残す
  console.log(`${util.GetUserName(msg.member)}, ${content}`)

  return 'Speaking Cal'
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
