import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '.'

/**
 * 送信されたメッセージに特定の文字が含まれていた場合、対応した絵文字をつける
 * @param msg DiscordからのMessage
 */
export const React = async (msg: Discord.Message) => {
  // 指定のチャンネルでは実行されない用にする
  if (util.IsChannel(Settings.NOT_EMOJI_CHANNEL, msg.channel)) return

  yuiKusanoReact(msg)
  mazarashiReact(msg)
  usamaruReact(msg)
  macchaDesuyoReact(msg)
  nikuReact(msg)
  pantiesReact(msg)
  ringorouReact(msg)
  smicleReact(msg)
  ohayouReact(msg)
  oyasumiReact(msg)
  otukareReact(msg)
  yoroshikuReact(msg)
  chuukaReact(msg)
}

/**
 * 送信されたメッセージに草野優衣っぽい文字が含まれていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 */
const yuiKusanoReact = (msg: Discord.Message) => {
  // 特定のチャンネルでは草単体でガチャを行うので絵文字は不要
  if (util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) {
    if (/^草\s?\d*$/.test(msg.content)) return
  }

  const match = msg.content.replace(/草|優衣|くさ$/g, 'ユイ').match(/ユイ/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.YUI_KUSANO)
  console.log('React Yui Kusano')
}

/**
 * 送信されたメッセージにまざらしっぽいの文字が含まれていた場合、まざらしの絵文字をつける
 * @param msg DiscordからのMessage
 */
const mazarashiReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/ま.{1,3}らし|厚着|冷凍|解凍/g, 'だめらし').match(/だめらし/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.MAZARASHI)
  console.log('React Mazarashi')
}

/**
 * 送信されたメッセージにうさまるっぽい文字が含まれていた場合、うさまるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const usamaruReact = (msg: Discord.Message) => {
  const match = msg.content
    .replace(
      /^うさ.{2,4}$|^.{2,4}まる$|兎丸|レジギガス|^レジ.{2,5}$|^.{2,5}ギガス$|ｷﾞｶﾞ|793515921128816670/g,
      'うさまる'
    )
    .match(/うさまる/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.USAMARU)
  console.log('React Usamaru')
}

/**
 * 送信されたメッセージに抹茶ですよっぽい文字が含まれていた場合、抹茶ですよの絵文字をつける
 * @param msg DiscordからのMessage
 */
const macchaDesuyoReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/抹茶|^まっちゃ/g, '利休').match(/利休/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.MACCHA_DESUYO)
  console.log('React Maccha Desuyo')
}

/**
 * 送信されたメッセージに肉が含まれていた場合、肉の絵文字をつける
 * @param msg DiscordからのMessage
 */
const nikuReact = (msg: Discord.Message) => {
  const match = msg.content.match(/肉/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.NIKU)
  console.log('React Niku')
}

/**
 * 送信されたメッセージにパンツっぽい文字が含まれていた場合、パンツの絵文字をつける
 * @param msg DiscordからのMessage
 */
const pantiesReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/ぱんつ|パンツ|パンティ|下着/g, 'しろは').match(/しろは/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.PANTIES)
  console.log('React Panties')
}

/**
 * 送信されたメッセージにりんごろうっぽい文字が含まれていた場合、りんごろうの絵文字をつける
 * @param msg DiscordからのMessage
 */
const ringorouReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/辻野|あかり|林檎|あっぷる|アップル/gi, 'んご').match(/んご/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.RINGOROU)
  console.log('React Ringorou')
}

/**
 * 送信されたメッセージにすまいるっぽい文字が含まれていた場合、すまいるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const smicleReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/スマイル|smicle/gi, 'すまいる').match(/すまいる/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.SMICLE)
  console.log('React smicle')
}

/**
 * 送信されたメッセージにおはようが含まれていた場合、おはようの絵文字をつける
 * @param msg DiscordからのMessage
 */
const ohayouReact = (msg: Discord.Message) => {
  const match = msg.content.match(/おはよう/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.OHAYOU)
  console.log('React ohayou')
}

/**
 * 送信されたメッセージにおやすみが含まれていた場合、おやすみの絵文字をつける
 * @param msg DiscordからのMessage
 */
const oyasumiReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/お休み/g, 'おやすみ').match(/おやすみ/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.OYASUMI)
  console.log('React oyasumi')
}

/**
 * 送信されたメッセージにおつかれが含まれていた場合、おつかれの絵文字をつける
 * @param msg DiscordからのMessage
 */
const otukareReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/お疲れ|おつです|おつでした|お先に?失礼|お先です/g, 'おつかれ').match(/おつかれ/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.OTUKARE)
  console.log('React otukare')
}

/**
 * 送信されたメッセージによろしくが含まれていた場合、よろしくの絵文字をつける
 * @param msg DiscordからのMessage
 */
const yoroshikuReact = (msg: Discord.Message) => {
  const match = msg.content.replace(/宜しく/g, 'よろしく').match(/よろしく/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.YOROSHIKU)
  console.log('React yoroshiku')
}

/**
 * 送信されたメッセージに中華が含まれていた場合、中華の絵文字をつける
 * @param msg DiscordからのMessage
 */
const chuukaReact = (msg: Discord.Message) => {
  const match = msg.content.match(/中華/)
  if (!match) return

  msg.react(Settings.EMOJI_ID.CHUUKA)
  console.log('React chuuka')
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、対応した絵文字を送信する
 * @param msg DiscordからのMessage
 * @return 送信した絵文字の結果
 */
export const Send = async (msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネルでは実行されない用にする
  if (util.IsChannel(Settings.NOT_EMOJI_CHANNEL, msg.channel)) return

  const name = `${util.GetUserName(msg.member)}`
  let content: string

  content = msg.content.replace(/るる/, 'ルル')
  if (content === 'ルル') return ruruEmoji(msg, name)

  content = msg.content.replace(/kmr/i, 'kmr')
  if (content === 'kmr') return kmrEmoji(msg, name)

  content = msg.content.replace(/あつもり/, '熱盛')
  if (content === '熱盛') return atsumoriEmoji(msg, name)

  content = msg.content.replace(/かちこみ|けんかか？|けんかか|ケンカか？|ケンカか|喧嘩か？/, '喧嘩か')
  if (content === '喧嘩か') return kenkakaEmoji(msg, name)

  content = msg.content
  if (content === 'kusa') return kusaEmoji(msg, name)

  content = msg.content.replace(/ぱんつ|パンティ/, 'パンツ')
  if (content === 'パンツ') return pantiesEmoji(msg, name)

  content = msg.content
  if (content === 'りんごろう') return ringorouEmoji(msg, name)

  content = msg.content.replace(/んも…|ンモ/, 'んも')
  if (content === 'んも') return nmoEmoji(msg, name)

  content = msg.content
  if (content === '白鳥') return shiratoriEmoji(msg, name)

  content = msg.content
  if (content === 'ア') return aEmoji(msg, name)

  content = msg.content.replace(/他人tl|tl奪取/i, '他人TL')
  if (content === '他人TL') return taninEmoji(msg, name)

  content = msg.content
  if (content === 'katudon') return katudonEmoji(msg, name)
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、ルルの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const ruruEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.RURU)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send ruru Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、kmrの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const kmrEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.KMR)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send kmr Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、熱盛の絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const atsumoriEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.ATSUMORI)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send atsumori Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、喧嘩か？の絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const kenkakaEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.KENKAKA)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send kenkaka Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、草の絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const kusaEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.KUSA)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send kusa Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、パンツの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const pantiesEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.PANTIES)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send panties Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、りんごろうの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const ringorouEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.RINGOROU)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send ringorou Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、んも…の絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const nmoEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.NMO)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send nmo Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、白鳥の絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const shiratoriEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.SHIRATORI)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send shiratori Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、アの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const aEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.A)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send A Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、他人TLの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const taninEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.TANIN)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send TaninTL Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、saitouの絵文字を送信する
 * @param msg DiscordからのMessage
 * @param name メッセージ送信者の名前
 */
const katudonEmoji = async (msg: Discord.Message, name: string) => {
  await msg.channel.send(Settings.EMOJI_FULL_ID.SAITOU)

  // ディレイを挟まないと残像が残る100ミリ秒待つ
  setTimeout(() => msg.delete(), 100)
  return `${name}: Send saitou Emoji`
}
