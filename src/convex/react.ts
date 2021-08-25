import Settings from 'const-settings'
import * as util from '../util'

/**
 * #凸宣言-ボス状況の絵文字を設定する
 */
export const SetDeclare = async () => {
  await Promise.all(
    'abcde'.split('').map(async alpha => {
      // チャンネルを取得
      const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

      // 凸宣言のメッセージを取得
      const declare = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)

      // 凸の絵文字を付ける
      await declare.react(Settings.EMOJI_ID.TOTU)

      // 持越の絵文字を付ける
      await declare.react(Settings.EMOJI_ID.MOCHIKOSHI)
    })
  )
}

/**
 * #活動時間のチャンネルを取得する
 */
export const SetActivityTime = async () => {
  // チャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 離席中のメッセージを取得
  const awayIn = await channel.messages.fetch(Settings.AWAY_IN)

  // 出席、離席の絵文字を付ける
  await awayIn.react(Settings.EMOJI_ID.SHUSEKI)
  await awayIn.react(Settings.EMOJI_ID.RISEKI)

  // 前半にリアクションを付ける
  const first = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._5)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._6)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._7)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._8)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._9)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._10)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._11)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._12)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._13)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._14)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._15)
  await first.react(Settings.TIME_LIMIT_EMOJI.EMOJI._16)

  // 後半にリアクションを付ける
  const latter = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._17)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._18)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._19)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._20)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._21)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._22)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._23)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._0)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._1)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._2)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._3)
  await latter.react(Settings.TIME_LIMIT_EMOJI.EMOJI._4)
}

/**
 * 特定のリアクションを先にキャッシュする
 */
export const Fetch = async () => {
  await Promise.all(
    'abcde'.split('').map(async alpha => {
      // 凸宣言のチャンネルを取得
      const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

      // 凸宣言のメッセージを取得
      const msgs = await channel.messages.fetch()

      // prettier-ignore
      // 凸宣言に付いているリアクションをキャッシュ
      await Promise.all(
        msgs.map(async msg => Promise.all(
          msg.reactions.cache.map(async r =>  r.users.fetch())
        ))
      )
    })
  )

  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 前半と後半のメッセージを取得
  const first = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  const latter = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)

  // メッセージに付いているリアクションをキャッシュ
  await Promise.all(first.reactions.cache.map(async r => r.users.fetch()))
  await Promise.all(latter.reactions.cache.map(async r => r.users.fetch()))
}
