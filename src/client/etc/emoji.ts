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

  // おはようの絵文字を押す
  ohayouReact(msg)

  // おやすみの絵文字を押す
  oyasumiReact(msg)

  // おつかれの絵文字を押す
  otukareReact(msg)

  // よろしくの絵文字を押す
  yoroshikuReact(msg)

  // 中華の絵文字を押す
  chuukaReact(msg)
}

/**
 * 送信されたメッセージに草野優衣っぽい文字が含まれていた場合、草野優衣の絵文字をつける
 * @param msg DiscordからのMessage
 */
const yuiKusanoReact = (msg: Discord.Message) => {
  // 指定のチャンネルで草を入力した場合はリアクションを付けない
  if (util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) {
    if (/^草\s?\d*$/.test(msg.content)) return
  }

  // 草野優衣っぽい文字が含まれているか確認
  const match = msg.content.replace(/草|優衣|くさ$/g, 'ユイ').match(/ユイ/)

  // 含まれていない場合は終了
  if (!match) return

  // 草野優衣の絵文字をつける
  msg.react(Settings.EMOJI_ID.YUI_KUSANO)

  console.log('React Yui Kusano')
}

/**
 * 送信されたメッセージにまざらしっぽいの文字が含まれていた場合、まざらしの絵文字をつける
 * @param msg DiscordからのMessage
 */
const mazarashiReact = (msg: Discord.Message) => {
  // まざらしっぽい文字が含まれているか確認
  const match = msg.content.replace(/ま.{1,3}らし|厚着|冷凍|解凍/g, 'だめらし').match(/だめらし/)

  // 含まれていない場合は終了
  if (!match) return

  // まざらしの絵文字をつける
  msg.react(Settings.EMOJI_ID.MAZARASHI)

  console.log('React Mazarashi')
}

/**
 * 送信されたメッセージにうさまるっぽい文字が含まれていた場合、うさまるの絵文字をつける
 * @param msg DiscordからのMessage
 */
const usamaruReact = (msg: Discord.Message) => {
  // うさまるっぽい文字が含まれているか確認
  const match = msg.content
    .replace(
      /^うさ.{2,4}$|^.{2,4}まる$|兎丸|レジギガス|^レジ.{2,5}$|^.{2,5}ギガス$|ｷﾞｶﾞ|793515921128816670/g,
      'うさまる'
    )
    .match(/うさまる/)

  // 含まれていない場合は終了
  if (!match) return

  // うさまるの絵文字をつける
  msg.react(Settings.EMOJI_ID.USAMARU)

  console.log('React Usamaru')
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

  console.log('React Maccha Desuyo')
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

  console.log('React Niku')
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

  console.log('React Panties')
}

/**
 * 送信されたメッセージにりんごろうっぽい文字が含まれていた場合、りんごろうの絵文字をつける
 * @param msg DiscordからのMessage
 */
const ringorouReact = (msg: Discord.Message) => {
  // りんごろうっぽい文字が含まれているか確認
  const match = msg.content.replace(/辻野|あかり|林檎|あっぷる|アップル/gi, 'んご').match(/んご/)

  // 含まれていない場合は終了
  if (!match) return

  // りんごろうの絵文字をつける
  msg.react(Settings.EMOJI_ID.RINGOROU)

  console.log('React Ringorou')
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

  console.log('React smicle')
}

/**
 * 送信されたメッセージにおはようが含まれていた場合、おはようの絵文字をつける
 * @param msg DiscordからのMessage
 */
const ohayouReact = (msg: Discord.Message) => {
  // おはようの文字が含まれているか確認
  const match = msg.content.match(/おはよう/)

  // 含まれていない場合は終了
  if (!match) return

  // おはようの絵文字をつける
  msg.react(Settings.EMOJI_ID.OHAYOU)

  console.log('React ohayou')
}

/**
 * 送信されたメッセージにおやすみが含まれていた場合、おやすみの絵文字をつける
 * @param msg DiscordからのMessage
 */
const oyasumiReact = (msg: Discord.Message) => {
  // おやすみの文字が含まれているか確認
  const match = msg.content.replace(/お休み/g, 'おやすみ').match(/おやすみ/)

  // 含まれていない場合は終了
  if (!match) return

  // おやすみの絵文字をつける
  msg.react(Settings.EMOJI_ID.OYASUMI)

  console.log('React oyasumi')
}

/**
 * 送信されたメッセージにおつかれが含まれていた場合、おつかれの絵文字をつける
 * @param msg DiscordからのMessage
 */
const otukareReact = (msg: Discord.Message) => {
  // おつかれの文字が含まれているか確認
  const match = msg.content.replace(/お疲れ/g, 'おつかれ').match(/おつかれ/)

  // 含まれていない場合は終了
  if (!match) return

  // おつかれの絵文字をつける
  msg.react(Settings.EMOJI_ID.OTUKARE)

  console.log('React otukare')
}

/**
 * 送信されたメッセージによろしくが含まれていた場合、よろしくの絵文字をつける
 * @param msg DiscordからのMessage
 */
const yoroshikuReact = (msg: Discord.Message) => {
  // よろしくの文字が含まれているか確認
  const match = msg.content.replace(/宜しく/g, 'よろしく').match(/よろしく/)

  // 含まれていない場合は終了
  if (!match) return

  // よろしくの絵文字をつける
  msg.react(Settings.EMOJI_ID.YOROSHIKU)

  console.log('React yoroshiku')
}

/**
 * 送信されたメッセージに中華が含まれていた場合、中華の絵文字をつける
 * @param msg DiscordからのMessage
 */
const chuukaReact = (msg: Discord.Message) => {
  // 中華の文字が含まれているか確認
  const match = msg.content.match(/中華/)

  // 含まれていない場合は終了
  if (!match) return

  // 中華の絵文字をつける
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
  content = msg.content.replace(/かちこみ|けんかか？|けんかか|ケンカか？|ケンカか|喧嘩か？/, '喧嘩か')
  if (content === '喧嘩か') return kenkakaEmoji(msg)

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
  content = msg.content.replace(/んも…|ンモ/, 'んも')
  if (content === 'んも') return nmoEmoji(msg)

  // 白鳥の絵文字を送信する
  content = msg.content
  if (content === '白鳥') return shiratoriEmoji(msg)

  // アの絵文字を送信する
  content = msg.content
  if (content === 'ア') return aEmoji(msg)

  // 他人TLの絵文字を送信する
  content = msg.content.replace(/他人tl|tl奪取/i, '他人TL')
  if (content === '他人TL') return taninEmoji(msg)

  // saitouの絵文字を送信する
  content = msg.content
  if (content === 'saitou') return saitouEmoji(msg)
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

  return `${util.GetUserName(msg.member)} Send ruru Emoji`
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

  return `${util.GetUserName(msg.member)} Send kmr Emoji`
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

  return `${util.GetUserName(msg.member)} Send atsumori Emoji`
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

  return `${util.GetUserName(msg.member)} Send kenkaka Emoji`
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

  return `${util.GetUserName(msg.member)} Send kusa Emoji`
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

  return `${util.GetUserName(msg.member)} Send panties Emoji`
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

  return `${util.GetUserName(msg.member)} Send ringorou Emoji`
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

  return `${util.GetUserName(msg.member)} Send nmo Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、白鳥の絵文字を送信する
 * @param msg DiscordからのMessage
 */
const shiratoriEmoji = async (msg: Discord.Message) => {
  // サルモネラ菌の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.SHIRATORI)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return `${util.GetUserName(msg.member)} Send shiratori Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、アの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const aEmoji = async (msg: Discord.Message) => {
  // スタンプ保管庫の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.A)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return `${util.GetUserName(msg.member)} Send A Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、他人TLの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const taninEmoji = async (msg: Discord.Message) => {
  // スタンプ保管庫の絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.TANIN)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return `${util.GetUserName(msg.member)} Send TaninTL Emoji`
}

/**
 * 送信されたメッセージに特定の文字が完全一致していた場合、saitouの絵文字を送信する
 * @param msg DiscordからのMessage
 */
const saitouEmoji = async (msg: Discord.Message) => {
  // べろばあのアニメーション絵文字を送信
  await msg.channel.send(Settings.EMOJI_FULL_ID.SAITOU)

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return `${util.GetUserName(msg.member)} Send saitou Emoji`
}
