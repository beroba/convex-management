import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 送信されたメッセージに特定の文字が含まれていた場合、対応した絵文字をつける
 * @param msg DiscordからのMessage
 */
export const React = async (msg: Discord.Message) => {
  // 指定のチャンネルでは実行されない用にする
  if (util.IsChannel(Settings.NOT_EMOJI_CHANNEL, msg.channel)) return

  // 草野優衣の絵文字を押す
  yuiKusanoReact(msg)

  // まざらしの絵文字を押す
  mazarashiReact(msg)

  // うさまるの絵文字を押す
  usamaruReact(msg)

  // 抹茶ですよの絵文字を押す
  macchaDesuyoReact(msg)

  // 肉の絵文字を押す
  nikuReact(msg)

  // パンツの絵文字を押す
  pantiesReact(msg)

  // りんごろうの絵文字を押す
  ringorouReact(msg)

  // すまいるの絵文字を押す
  smicleReact(msg)
}

/**
 * 送信されたメッセージに草野優衣っぽい文字が含まれていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 */
const yuiKusanoReact = (msg: Discord.Message) => {
  // 草野優衣っぽい文字が含まれているか確認
  const match = msg.content.replace(/草|優衣|くさ$/g, 'ユイ').match(/ユイ/)

  // 含まれていない場合は終了
  if (!match) return

  // 草野優衣の絵文字をつける
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  console.log('React Yui Kusano react')
}

/**
 * 送信されたメッセージにまざらしっぽいの文字が含まれていた場合、まざらしの絵文字をつける
 * @param msg DiscordからのMessage
 */
const mazarashiReact = (msg: Discord.Message) => {
  // まざらしっぽい文字が含まれているか確認
  const match = msg.content
    .replace(/ま.+らし|厚着|下着|冷凍|解凍|むちむち|オクトー|だめらし|722547140487938181/g, 'まらざし')
    .match(/まらざし/)

  // 含まれていない場合は終了
  if (!match) return

  // まざらしの絵文字をつける
  msg.react(Settings.EMOJI_ID.MAZARASHI)

  console.log('React Mazarashi react')
}

/**
 * 送信されたメッセージにうさまるっぽい文字が含まれていた場合、うさまるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const usamaruReact = (msg: Discord.Message) => {
  // うさまるっぽい文字が含まれているか確認
  const match = msg.content
    .replace(/^うさ..|..まる$|兎丸|レジギガス|^レジ...|..ギガス$|ｷﾞｶﾞ|652747597739589632/g, 'うさまる')
    .match(/うさまる/)

  // 含まれていない場合は終了
  if (!match) return

  // うさまるの絵文字をつける
  msg.react(Settings.EMOJI_ID.USAMARU)

  console.log('React Usamaru react')
}

/**
 * 送信されたメッセージに抹茶ですよっぽい文字が含まれていた場合、抹茶ですよの絵文字をつける
 * @param msg DiscordからのMessage
 */
const macchaDesuyoReact = (msg: Discord.Message) => {
  // 抹茶ですよっぽい文字が含まれているか確認
  const match = msg.content.replace(/抹茶|^まっちゃ/g, '利休').match(/利休/)

  // 含まれていない場合は終了
  if (!match) return

  // 抹茶ですよの絵文字をつける
  msg.react(Settings.EMOJI_ID.MACCHA_DESUYO)

  console.log('React Maccha Desuyo react')
}

/**
 * 送信されたメッセージに肉が含まれていた場合、肉の絵文字をつける
 * @param msg DiscordからのMessage
 */
const nikuReact = (msg: Discord.Message) => {
  // 肉が含まれているか確認
  const match = msg.content.match(/肉/)

  // 含まれていない場合は終了
  if (!match) return

  // 肉の絵文字をつける
  msg.react(Settings.EMOJI_ID.NIKU)

  console.log('React Niku react')
}

/**
 * 送信されたメッセージにパンツっぽい文字が含まれていた場合、パンツの絵文字をつける
 * @param msg DiscordからのMessage
 */
const pantiesReact = (msg: Discord.Message) => {
  // パンツっぽ文字が含まれているか確認
  const match = msg.content.replace(/ぱんつ|パンツ|パンティ|下着/g, 'しろは').match(/しろは/)

  // 含まれていない場合は終了
  if (!match) return

  // 肉の絵文字をつける
  msg.react(Settings.EMOJI_ID.PANTIES)

  console.log('React Panties react')
}

/**
 * 送信されたメッセージにりんごろうっぽい文字が含まれていた場合、りんごろうの絵文字をつける
 * @param msg DiscordからのMessage
 */
const ringorouReact = (msg: Discord.Message) => {
  // りんごろうっぽい文字が含まれているか確認
  const match = msg.content.replace(/んご|ンゴ|辻野|あかり|ﾝｺﾞ|あっぷる|アップル|apple/gi, 'んご').match(/んご/)

  // 含まれていない場合は終了
  if (!match) return

  // りんごろうの絵文字をつける
  msg.react(Settings.EMOJI_ID.RINGOROU)

  console.log('React Ringorou react')
}

/**
 * 送信されたメッセージにすまいるっぽい文字が含まれていた場合、すまいるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const smicleReact = (msg: Discord.Message) => {
  // すまいるっぽい文字が含まれているか確認
  const match = msg.content.replace(/スマイル|smicle/gi, 'すまいる').match(/すまいる/)

  // 含まれていない場合は終了
  if (!match) return

  // すまいるの絵文字をつける
  msg.react(Settings.EMOJI_ID.SMICLE)

  console.log('React smicle react')
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、対応した絵文字を送信する
 * @param msg DiscordからのMessage
 * @return 送信した絵文字の結果
 */
export const Send = async (msg: Discord.Message): Promise<Option<string>> => {
  let content: string

  // ルルの絵文字を送信する
  content = msg.content.replace(/るる/, 'ルル')
  if (content === 'ルル') return ruruEmoji(msg)

  // kmrの絵文字を送信する
  content = msg.content.replace(/kmr/i, 'kmr')
  if (content === 'kmr') return kmrEmoji(msg)

  // 熱盛の絵文字を送信する
  content = msg.content.replace(/あつもり/, '熱盛')
  if (content === '熱盛') return atsumoriEmoji(msg)

  // 喧嘩か？の絵文字を送信する
  content = msg.content.replace(/かちこみ|けんかか？|けんかか|ケンカか？|ケンカか|喧嘩か/, '喧嘩か？')
  if (content === '喧嘩か？') return kenkakaEmoji(msg)

  // 草の絵文字を送信する
  content = msg.content
  if (content === 'kusa') return kusaEmoji(msg)

  // パンツの絵文字を送信する
  content = msg.content.replace(/ぱんつ|パンティ/, 'パンツ')
  if (content === 'パンツ') return pantiesEmoji(msg)

  // りんごろうの絵文字を送信する
  content = msg.content
  if (content === 'りんごろう') return ringorouEmoji(msg)

  // んも…の絵文字を送信する
  content = content = msg.content.replace(/んも…|ンモ/, 'んも')
  if (content === 'んも') return nmoEmoji(msg)
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、ルルの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const ruruEmoji = async (msg: Discord.Message) => {
  // 焼肉カンパニ！の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.RURU)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send ruru Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、kmrの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const kmrEmoji = async (msg: Discord.Message) => {
  // 焼肉カンパニ！の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.KMR)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send kmr Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、熱盛の絵文字を送信する
 * @param msg DiscordからのMessage
 */
const atsumoriEmoji = async (msg: Discord.Message) => {
  // 焼肉カンパニ！の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.ATSUMORI)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send atsumori Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、喧嘩か？の絵文字を送信する
 * @param msg DiscordからのMessage
 */
const kenkakaEmoji = async (msg: Discord.Message) => {
  // 焼肉カンパニ！の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.KENKAKA)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send kenkaka Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、草の絵文字を送信する
 * @param msg DiscordからのMessage
 */
const kusaEmoji = async (msg: Discord.Message) => {
  // ﾖｺﾀﾊｲｲﾋﾄの絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.KUSA)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send kusa Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、パンツの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const pantiesEmoji = async (msg: Discord.Message) => {
  // スタンプ保管庫の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.PANTIES)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send kusa Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、りんごろうの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const ringorouEmoji = async (msg: Discord.Message) => {
  // サルモネラ菌の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.RINGOROU)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send ringorou Emoji'
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、んも…の絵文字を送信する
 * @param msg DiscordからのMessage
 */
const nmoEmoji = async (msg: Discord.Message) => {
  // スタンプ保管庫の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.NMO)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send nmo Emoji'
}
