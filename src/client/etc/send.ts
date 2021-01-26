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
  if (msg.member?.user.bot) return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // urlの場合は終了する
  if (msg.content.match(/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/)) return

  // コードブロックの場合は終了
  if (/\`\`\`/.test(msg.content)) return

  // 全角を半角に変換する
  const content = util.Format(msg.content)

  // 絵文字だけ抜き出したリストを作る
  const emoji = content.match(/<.*?>/g)?.map(e => e)

  // discord以外のorが含まれている最初の行を取得
  const line = content
    .replace(/<.*?>/g, '１') // 絵文字を全て１に変換
    .split('\n')
    .find(s => /^.+(?<![dis][cord])or.+$/i.test(s))

  // discord以外のorがなければ終了
  if (!line) return

  // 絵文字を元に戻したリストを作成
  const list = replaceEmoji(
    // discord以外のorで区切ったリストを作る
    line.split(/(?<![dis][cord])or/i).map(s => s.trim()),
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

/**
 * 送信されたメッセージがシャイニートモの場合、シャイニートモの画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const ShinyTmoImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.THIS_AND_THAT_CHANNEL, msg.channel)) return

  // シャイニートモの文字か確認
  if (msg.content !== 'シャイニートモ') return

  // ヤバイわよ！の画像を送信
  msg.channel.send('', {files: [Settings.URL.SHINYTMO]})

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send Yabai Image'
}
