import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 送信されたメッセージの先頭がおはなしの場合、元のメッセージを削除しキャルがメッセージを送信する
 * @param msg DiscordからのMessage
 * @return おはなしの結果
 */
export const Speak = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // 漢字でも動くようにする
  const adjustment = msg.content.replace('　', ' ').replace(/お話し|お話/, 'おはなし')

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
  if (msg.member?.user.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // urlの場合は終了
  if (/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/.test(msg.content)) return

  // 英単語の中身にorがある場合は終了
  if (/[a-z|A-Z]or[a-z|A-Z]/.test(msg.content)) return

  // コードブロックの場合は終了
  if (/\`\`\`/.test(msg.content)) return

  // 全角を半角に変換
  const content = util.Format(msg.content)

  // 絵文字だけ抜き出したリストを作る
  const emoji = content.match(/<.*?>/g)?.map(e => e)

  // orが含まれている最初の行を取得
  const line = content
    .replace(/<.*?>/g, '１') // 絵文字を全て１に変換
    .split('\n')
    .find(s => /^.+or.+$/.test(s))

  // orがなければ終了
  if (!line) return

  // orで文字列を区切る
  const raw = line.split(/or/)

  // 12文字を超える文字列がある場合は終了
  const bool = raw
    .filter(c => !/^\s.+$/.test(c) && !/^.+\s$/.test(c)) // 両端にスペースが入ってない文字列だけにする
    .find(c => c.length > 10) // 12文字を超える文字列を取得
  if (bool) return

  // 絵文字を元に戻したリストを作成
  const list = replaceEmoji(
    raw.map(l => l.trim()),
    emoji
  )

  // リストの数に応じて乱数を作る
  const rand = createRandNumber(list.length)
  msg.reply(list[rand])

  // 誰が送信したかのログを残す
  console.log(`${util.GetUserName(msg.member)}, ${content}`)

  return 'Returned any of or'
}

/**
 * 第1引数で渡されたリストの１を、第2引数で渡された絵文字に入れ替えて返す
 * @param list 変換元のリスト
 * @param emoji 入れ替える絵文字のリスト
 * @return 入れ替えたリスト
 */
const replaceEmoji = (list: string[], emoji: Option<string[]>): string[] => {
  // 絵文字がない場合は終了
  if (!emoji) return list

  // 絵文字のカウンタを作成
  let i = 0
  return list.map(l => {
    // 全ての１が絵文字になるまでループする
    // 無限ループにならない用に20で止まるように保険をかけておく
    for (let j = 0; j < 20; j++) {
      // １がなくなったら終了
      if (!/１/.test(l)) return l
      // １を絵文字に変換し、絵文字のカウンタを上げる
      l = l.replace('１', emoji[i++])
    }
    return l
  })
}

/**
 * 引数に渡された整数の範囲で乱数を生成する
 * @param n 乱数の生成範囲
 * @return 乱数
 */
const createRandNumber = (n: number): number => require('get-random-values')(new Uint8Array(1))[0] % n

/**
 * 送信されたメッセージにカンカンカンが含まれていた場合おはよーを送信する
 * @param msg DiscordからのMessage
 * @return カンカンカンが含まれていたかの結果
 */
export const GoodMorning = (msg: Discord.Message): Option<string> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

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
 * 送信されたメッセージが履歴埋めの場合アリーナガイジを送信する
 * @param msg DiscordからのMessage
 * @return 履歴埋めかどうかの結果
 */
export const ArenaGaiji = (msg: Discord.Message): Option<string> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // 履歴埋めでなければ終了
  if (msg.content.replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '').trim() !== '履歴埋め') return

  // 履歴埋めのメッセージ
  const message = [
    '君プリコネ上手いね？誰推し？てかアリーナやってる？',
    '履歴埋めってのがあってさ、一瞬！1回だけやってみない？',
    '大丈夫すぐやめれるし',
    '気持ちよくなれるよ',
  ].join('\n')

  // メッセージ送信先のチャンネルを取得
  const channel = util.GetTextChannel(msg.channel.id)
  channel.send(message)

  return 'Arena Gaiji'
}

/**
 * 送信されたメッセージにヤバイの文字が含まれていた場合、ヤバイわよ！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const YabaiImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // 文字にやばいが含まれているか確認
  const match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/)

  // 含まれていない場合は終了
  if (!match) return

  // ヤバイわよ！の画像を送信
  msg.channel.send('', {files: [Settings.URL.YABAIWAYO]})

  return 'Send Yabai Image'
}

/**
 * 送信されたメッセージがシャイニートモの場合、シャイニートモの画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const ShinyTmoImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // 文字がシャイニートモか確認
  if (msg.content !== 'シャイニートモ') return

  // シャイニートモの画像を送信
  msg.channel.send('', {files: [Settings.URL.SHINYTMO]})

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send Yabai Image'
}

/**
 * 送信されたメッセージが草の場合、草ガチャを実施する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const KusaGacha = async (msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // 文字が草か確認
  if (msg.content !== '草') return

  // ガチャの内容を作成
  const items: string[] = Settings.KUSA.map((v: {NAME: string; RATIO: string}) => Array(v.RATIO).fill(v.NAME)).flat()

  // 乱数を生成
  const rand = createRandNumber(items.length)

  // 草の画像を送信
  msg.reply(items[rand], {files: [`./assets/kusa/${items[rand]}.png`]})

  return 'Send Kusa Gacha'
}

/**
 #肉に画像が送信された際に肉の絵文字を付ける
 * @param msg DiscordからのMessage
 * @return リアクションしたかの結果
 */
export const NikuPicture = (msg: Discord.Message): Option<string> => {
  // #肉でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.NIKU) return

  // メッセージに画像があるか確認する
  const url = msg.attachments.map(a => a.url)[0]
  if (!url) return

  // 肉の絵文字をつける
  msg.react(Settings.EMOJI_ID.NIKU)

  // 飯テロリストのロールを付与する
  msg.member?.roles.add(Settings.ROLE_ID.MESHI_TERO)

  return 'React Niku Channel'
}

/**
 * #性癖調査18禁 #性癖調査よろず18禁に投稿した人に性癖調査をしろロールを付与
 * @param msg DiscordからのMessage
 * @return ロールを付与したかの結果
 */
export const AddSeihekiRole = (msg: Discord.Message): Option<string> => {
  // #性癖調査18禁 #性癖調査よろず18禁でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.SEIHEKI && msg.channel.id !== Settings.CHANNEL_ID.SEIHEKI_YOROZU) return

  // 飯テロリストのロールを付与する
  msg.member?.roles.add(Settings.ROLE_ID.SEIHEKI)

  return 'Add Seiheki Role'
}
