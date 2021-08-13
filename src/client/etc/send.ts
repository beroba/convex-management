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
  if (!util.IsChannel(Settings.MAJOR_THAT_CHANNEL, msg.channel)) return

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
  if (!util.IsChannel(Settings.MAJOR_THAT_CHANNEL, msg.channel)) return

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
  if (!util.IsChannel(Settings.MAJOR_THAT_CHANNEL, msg.channel)) return

  // カンカンカンの文字が含まれているか確認
  if (!msg.content.match(/カンカンカン/)) return

  // カンカンカンのメッセージ
  const message =
    'おはよー！！！カンカンカン！！！起きなさい！！！クラバトよ！！！！すごいクラバトよ！！！！外が明るいわよ！！カンカンカンカンカン！！！！！おはよ！！カンカンカン！！！見て見て！！！！外明るいの！！！外！！！！見て！！カンカンカンカンカン！！凸しなさい！！早く凸して！！カンカン！ぶっ殺すわよ！！！！！！！！！！:heavy_check_mark:'

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
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字にやばいが含まれているか確認
  const match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/)

  // 含まれていない場合は終了
  if (!match) return

  // ヤバイわよ！の画像を送信
  msg.channel.send({files: [Settings.URL.YABAIWAYO]})

  return 'Send Yabai Image'
}

/**
 * 送信されたメッセージがシャイニートモの場合、シャイニートモの画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const ShinyTmoImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字がシャイニートモか確認
  if (msg.content !== 'シャイニートモ') return

  // シャイニートモの画像を送信
  msg.channel.send({files: [Settings.URL.SHINYTMO]})

  // 元のメッセージは削除
  setTimeout(() => msg.delete(), 100)

  return 'Send ShinyTmo Image'
}

/**
 * 送信されたメッセージが助けて！の場合、助けて！の画像を送信する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const TasuketeImage = (msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字が助けて！か確認
  if (!/^助けて(!|！)$/.test(msg.content)) return

  // 助けて！の画像を送信
  msg.channel.send({files: [Settings.URL.TASUKETE]})

  return 'Send Tasukete Image'
}

/**
 * 送信されたメッセージが草の場合、草ガチャを実施する
 * @param msg DiscordからのMessage
 * @return 画像を送信したかの結果
 */
export const KusaGacha = async (msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字が草か確認
  if (!/^草\s?\d*$/.test(msg.content)) return

  // ガチャの内容を作成
  const items: string[] = Settings.KUSA.map((v: {NAME: string; RATIO: string}) => Array(v.RATIO).fill(v.NAME)).flat()

  // 抽選する回数を取得
  const c = msg.content.replace(/[^1-5]/g, '').to_n()
  if (c) {
    util.range(c > 5 ? 5 : c).forEach(_ => {
      // リストの数に応じて乱数を作る
      const rand = createRandNumber(items.length)
      // 草の画像を送信
      msg.reply({
        content: `${items[rand]}:heavy_check_mark:`,
        files: [`./assets/kusa/${items[rand]}.png`],
      })
    })
  } else {
    // リストの数に応じて乱数を作る
    const rand = createRandNumber(items.length)
    // 草の画像を送信
    msg.reply({
      content: `${items[rand]}:heavy_check_mark:`,
      files: [`./assets/kusa/${items[rand]}.png`],
    })
  }

  return 'Send Kusa Gacha'
}

/**
 * 送信されたメッセージが俺嘘の場合、#さとりんご名言ツイートからツイートをランダムで送信
 * @param msg DiscordからのMessage
 * @return ツイートを送信したかの結果
 */
export const SendUsoOre = async (msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字が俺嘘か確認
  if (!/^(俺嘘|嘘俺)\s?([1-5]|読み?)*$/.test(msg.content)) return

  // #さとりんご名言ツイートからTweet一覧を取得する
  const list = await fetchTweetList()
  if (!list) return

  // 読み?がある場合は読み上げをする
  if (/読み?/.test(msg.content)) {
    // リストの数に応じて乱数を作る
    const rand = createRandNumber(list.length)
    msg.reply(list.splice(rand, 1).first())

    return 'Send UsoOre'
  }

  // Tweetリストから選別して送信
  sendTweetLottery(list, msg)

  return 'Send UsoOre'
}

/**
 * 送信されたメッセージがアザラシの場合、#さとりんご名言ツイートからアザラシシーパラダイスのツイートをランダムで送信
 * @param msg DiscordからのMessage
 * @return ツイートを送信したかの結果
 */
export const SendAguhiyori = async (msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.NETA_THAT_CHANNEL, msg.channel)) return

  // 文字が俺嘘か確認
  if (!/^アザラシ\s?([1-5]|読み?)*$/.test(msg.content)) return

  // #さとりんご名言ツイートからTweet一覧を取得する
  let list = await fetchTweetList()
  if (!list) return

  // アザラシシーパラダイスのツイートだけ選別
  list = list.filter(m => /aguhiyori/.test(m))

  // Tweetリストから選別して送信
  sendTweetLottery(list, msg)

  return 'Send Aguhiyori'
}

/**
 * #さとりんご名言ツイートからTweet一覧を取得する
 */
const fetchTweetList = async () => {
  // さとりんご名言ツイートのメッセージを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.OREUSO)
  const msgs: Discord.Message[] = []

  // 取得するメッセージの上限を設定
  const limit = 500
  const rounds = limit / 100 + (limit % 100 ? 1 : 0)

  // 取得した最後のメッセージを保存
  let last_id = ''
  for (let i = 0; i < rounds; i++) {
    // オプションの設定
    const options: Discord.ChannelLogsQueryOptions = {limit: 100}
    if (last_id.length > 0) {
      options.before = last_id
    }

    // メッセージを取得
    const messages = (await channel.messages.fetch(options)).map(m => m)
    msgs.push(...messages)

    // 最後のメッセージを更新
    last_id = messages.last().id
    // 最後のメッセージが特定のメッセージなら終了
    if (last_id === Settings.UsoOreLast) break
  }

  // ツイートの一覧を取得
  return msgs
    .map(m => m.embeds)
    .reduce((pre, current) => {
      // 配列を1重にする
      pre.push(...current)
      return pre
    }, [])
    .map(m => `${m.description}\n${m.url}`)
    .filter(m => /twitter\.com/.test(m))
}

/**
 * Tweetリストから選別して送信する
 * @param list Tweetのリスト
 * @param msg DiscordからのMessage
 */
const sendTweetLottery = (list: string[], msg: Discord.Message) => {
  // 抽選する回数を取得
  const c = msg.content.replace(/[^1-5]/g, '').to_n()
  if (c) {
    util.range(c > 5 ? 5 : c).forEach(c => {
      // リストの数に応じて乱数を作る
      const rand = createRandNumber(list.length)
      msg.reply(`${c + 1}:heavy_check_mark:\n${list.splice(rand, 1).first().split('\n').last()}`)
    })
  } else {
    // リストの数に応じて乱数を作る
    const rand = createRandNumber(list.length)
    msg.reply(list.splice(rand, 1).first().split('\n').last())
  }
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
  const url = msg.attachments.map(a => a.url).first()
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
