import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 特定のメッセージに絵文字を付ける
 * @param msg DiscordからのMessage
 */
export const Emoji = (msg: Discord.Message) => {
  // 指定のチャンネルでは実行されない用にする
  if (util.IsChannel(Settings.NOT_EMOJI_CHANNEL, msg.channel)) return

  // 草野優衣の絵文字を押す
  yuiKusanoEmoji(msg)
  // まざらしの絵文字を押す
  mazarashiEmoji(msg)
  // うさまるの絵文字を押す
  usamaruEmoji(msg)
  // 抹茶ですよの絵文字を押す
  macchaDesuyoEmoji(msg)
  // 肉の絵文字を押す
  nikuEmoji(msg)
}

/**
 * 送信されたメッセージに草野優衣っぽい文字が含まれていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 */
const yuiKusanoEmoji = (msg: Discord.Message) => {
  // 草野優衣っぽい文字が含まれているか確認
  const match = msg.content.replace(/草|優衣|^くさ|くさ$/g, 'ユイ').match(/ユイ/)

  // 含まれていない場合は終了
  if (!match) return

  // 草野優衣の絵文字をつける
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  console.log('React Yui Kusano emoji')
}

/**
 * 送信されたメッセージにまざらしっぽいの文字が含まれていた場合、まざらしの絵文字をつける
 * @param msg DiscordからのMessage
 */
const mazarashiEmoji = (msg: Discord.Message) => {
  // まざらしっぽい文字が含まれているか確認
  const match = msg.content.replace(/ま.+らし|厚着|下着|冷凍|解凍|722547140487938181/g, 'まらざし').match(/まらざし/)

  // 含まれていない場合は終了
  if (!match) return

  // まざらしの絵文字をつける
  msg.react(Settings.EMOJI_ID.MAZARASHI)

  console.log('React Mazarashi emoji')
}

/**
 * 送信されたメッセージにうさまるっぽい文字が含まれていた場合、うさまるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const usamaruEmoji = (msg: Discord.Message) => {
  // うさまるっぽい文字が含まれているか確認
  const match = msg.content
    .replace(/^うさ..|..まる$|兎丸|レジギガス|^レジ...|..ギガス$|ｷﾞｶﾞ|652747597739589632/g, 'うさまる')
    .match(/うさまる/)

  // 含まれていない場合は終了
  if (!match) return

  // うさまるの絵文字をつける
  msg.react(Settings.EMOJI_ID.USAMARU)

  console.log('React Usamaru emoji')
}

/**
 * 送信されたメッセージに抹茶ですよっぽい文字が含まれていた場合、抹茶ですよの絵文字をつける
 * @param msg DiscordからのMessage
 */
const macchaDesuyoEmoji = (msg: Discord.Message) => {
  // 抹茶ですよっぽい文字が含まれているか確認
  const match = msg.content.replace(/抹茶|^まっちゃ/g, '利休').match(/利休/)

  // 含まれていない場合は終了
  if (!match) return

  // 抹茶ですよの絵文字をつける
  msg.react(Settings.EMOJI_ID.MACCHA_DESUYO)

  console.log('React Maccha Desuyo emoji')
}

/**
 * 送信されたメッセージに肉が含まれていた場合、肉の絵文字をつける
 * @param msg DiscordからのMessage
 */
const nikuEmoji = (msg: Discord.Message) => {
  // 肉が含まれているか確認
  const match = msg.content.match(/肉/)

  // 含まれていない場合は終了
  if (!match) return

  // 肉の絵文字をつける
  msg.react(Settings.EMOJI_ID.NIKU)

  console.log('React Niku emoji')
}

/**
 * 送信されたメッセージの先頭がおはなしの場合、元のメッセージを削除しキャルがメッセージを送信する
 * @param msg DiscordからのMessage
 * @return おはなしの結果
 */
export const Speak = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

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

  // 誰が送信したかのログを残す
  console.log(`${util.GetUserName(msg.member)}, ${content}`)

  return 'Speaking Cal'
}

/**
 * 送信されたメッセージにorが含まれていた場合、orで区切ったどれかを乱数で送信する
 * @param msg DiscordからのMessage
 * @return orが含まれていたかの結果
 */
export const AorB = (msg: Discord.Message): Option<string> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // discord以外のorが含まれている最初の行を取得
  const content = msg.content.split('\n').find(s => /^.+(?<![dis][cord])or.+$/i.test(s))

  // discord以外のorがなければ終了
  if (!content) return

  // discord以外のorで区切ったリストを作る
  const list = content.split(/(?<![dis][cord])or/i).map(s => s.trim())

  // リストの数に応じて乱数を作る
  const rand = createRandNumber(list.length)

  // メッセージ送信先のチャンネルを取得
  const channel = util.GetTextChannel(msg.channel.id)
  channel.send(list[rand])

  // 誰が送信したかのログを残す
  console.log(`${util.GetUserName(msg.member)}, ${content}`)

  return 'Returned any of or'
}

/**
 * 送信されたメッセージにカンカンカンが含まれていた場合おはよーを送信する
 * @param msg DiscordからのMessage
 * @return カンカンカンが含まれていたかの結果
 */
export const GoodMorning = (msg: Discord.Message): Option<string> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // カンカンカンの文字が含まれているか確認
  if (!msg.content.match(/カンカンカン/)) return

  // カンカンカンのメッセージ
  const message =
    'おはよー！！！カンカンカン！！！起きなさい！！！クラバトよ！！！！すごいクラバトよ！！！！外が明るいわよ！！カンカンカンカンカン！！！！！おはよ！！カンカンカン！！！見て見て！！！！外明るいの！！！外！！！！見て！！カンカンカンカンカン！！凸しなさい！！早く凸して！！カンカン！ぶっ殺すわよ！！！！！！！！！！'

  // メッセージ送信先のチャンネルを取得
  const channel = util.GetTextChannel(msg.channel.id)
  channel.send(message)

  return 'Good morning'
}

/**
 * 引数に渡された整数の範囲で乱数を生成する
 * @param n 乱数の生成範囲
 * @return 乱数
 */
const createRandNumber = (n: number): number => require('get-random-values')(new Uint8Array(1))[0] % n

/**
 * 送信されたメッセージにヤバイの文字が含まれていた場合、ヤバイわよ！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const YabaiImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // ヤバイの文字が含まれているか確認
  const match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/)

  // 含まれていない場合は終了
  if (!match) return

  // ヤバイわよ！の画像を送信
  msg.channel.send('', {files: [Settings.URL.YABAIWAYO]})

  return 'Send Yabai Image'
}
