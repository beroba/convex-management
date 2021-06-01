import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import {Current, AtoE} from '../../io/type'

/**
 * ボスの状態を変更する
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 */
export const Update = async (alpha: AtoE, state?: Current, channel?: Discord.TextChannel) => {
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.CONVEX_DECLARE[alpha].CHANNEL)

  // 現在のボスのHPを取得
  const maxHP = Settings.STAGE[state.stage].HP[alpha]

  // ボスの状態のメッセージを取得
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE[alpha].STATUS)

  // 表示するテキストを作成
  const text = [
    `\`${state.lap}\`週目 \`${state[alpha].name}\` \`${state[alpha].hp}/${maxHP}\``,
    `予想残りHP \`${await expectRemainingHP(state[alpha].hp, channel)}\``,
  ].join('\n')

  // メッセージを編集
  await msg.edit(text)
}

/**
 * HPの計算とリアクションを付ける
 * @param msg DiscordからのMessage
 * @return 凸予定の実行結果
 */
export const React = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 全角を半角に変換
  let content = util.Format(msg.content)
  // @とsが両方ある場合は@を消す
  content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    // HPの変更
    await RemainingHPChange(content)

    // メッセージの削除
    msg.delete()

    return 'Remaining HP change'
  }

  // 通しと持越と待機の絵文字を付ける
  await msg.react(Settings.EMOJI_ID.TOOSHI)
  await msg.react(Settings.EMOJI_ID.MOCHIKOSHI)
  await msg.react(Settings.EMOJI_ID.TAIKI)
  console.log('Set declare reactions')

  // 現在の状況を取得
  const state = await current.Fetch()

  // 現在の状態を更新
  Update(state)

  // 離席中ロールを削除
  await msg.member?.roles.remove(Settings.ROLE_ID.AWAY_IN)

  return 'Calculate the HP'
}

/**
 * ボスの残りHPを更新する
 * @param content 変更先HPのメッセージ
 */
export const RemainingHPChange = async (content: string) => {
  // 変更先のHPを取り出す
  const at = content.replace(/^.*@/g, '').trim().replace(/\s.*$/g, '')

  // HPの変更
  const state = await current.UpdateBossHp(at)

  // 状態を変更
  await Update(state)
}

/**
 * 予想残りHPを計算する
 * @param HP 現在のHP
 * @param channel 凸宣言のチャンネル
 * @return 計算した残りHP
 */
const expectRemainingHP = async (HP: number, channel: Discord.TextChannel): Promise<number> => {
  // 全員のダメージ報告からダメージをリストにして取り出す
  const list = (await channel.messages.fetch())
    .map(m => m)
    .filter(m => !m.author.bot)
    .map(m => {
      // 全角を半角に変換
      let content = util.Format(m.content)
      // @とsが両方ある場合は@を消す
      content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content

      // ダメージだけ取りだす
      const list = content
        .replace(/\d*(s|秒)/gi, '')
        .trim()
        .match(/[\d]+/g)

      // リストがnullなら終了
      if (!list) return

      // リストの中から1番大きい値を返す
      return Math.max(...list.map(Number))
    })
    .map(Number)
    .map(n => (Number.isNaN(n) ? 0 : n)) // NaNが混ざってたら0に変換

  // ダメージがある場合は合計値、ない場合は0を代入
  let damage = list.length ? list.reduce((a, b) => a + b) : 0
  // リストにダメージがある場合は合計値、ない場合は0を代入
  // const damage = list.length && list.reduce((a, b) => a + b)

  // 残りHPを計算
  const hp = HP - damage

  // 0以下なら0にする
  return hp >= 0 ? hp : 0
}

/**
 * #凸宣言-ボス状況のメッセージを削除した際に残りHPの計算を行う
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const MessageDelete = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 現在の状況を取得
  const state = await current.Fetch()

  // 現在の状態を更新
  Update(state)

  return 'Calculate the HP'
}

/**
 * 渡されたユーザーのメッセージを全て削除する
 * @param user 削除したいメッセージのユーザー
 */
export const UserMessageAllDelete = async (user: Discord.User) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言完了者のメッセージを全て削除
  await Promise.all(
    (
      await channel.messages.fetch()
    )
      .map(m => m)
      .filter(m => m.author.id === user.id)
      .map(m => m.delete())
  )
}
