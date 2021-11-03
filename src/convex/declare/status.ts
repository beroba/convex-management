import * as Discord from 'discord.js'
// import Settings from 'const-settings'
import * as list from './list'
import * as lapAndBoss from '../lapAndBoss'
import * as situation from '../situation'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Current} from '../../util/type'

/**
 * ボスの残りHPを更新する
 * @param content 変更先HPのメッセージ
 * @param alpha ボス番号
 * @param state 現在の状況
 * @return 変更後の状態
 */
export const RemainingHPChange = async (content: string, alpha: AtoE, state?: Current): Promise<Current> => {
  state ??= await current.Fetch()

  // 変更先のHPを取り出す
  const hp = content
    .replace(/^.*@/g, '')
    .trim()
    .replace(/\s.*$/g, '')
    .match(/\d*/)
    ?.map(e => e)
    .first()

  // 数字がない又は値がない場合は終了
  if (hp === '' || hp === undefined) return <Current>{}

  // HPの変更
  state = await lapAndBoss.UpdateHP(hp.to_n(), alpha, state)

  await list.SetDamage(alpha, state)

  const members = await status.Fetch()
  situation.Report(members)

  return state
}

/**
 * ダメージ報告の合計ダメージを計算する
 * @param channel 凸宣言のチャンネル
 * @return 合計ダメージ
 */
export const TotalDamage = async (channel: Discord.TextChannel): Promise<number> => {
  // 全員のダメージ報告からダメージをリストにして取り出す
  const list = (await channel.messages.fetch())
    .map(m => m)
    .filter(m => !m.author.bot)
    .map(m => {
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

  // リストにダメージがある場合は合計値、ない場合は0を代入
  return list.length && list.reduce((a, b) => a + b)
}

/**
 * 予想残りHPを計算する
 * @param HP 現在のHP
 * @param damage ダメージ報告の合計ダメージ
 * @return 残りHP
 */
export const ExpectRemainingHP = (HP: number, damage: number): number => {
  // 残りHPを計算
  const hp = HP - damage

  // 0以下なら0にする
  return hp >= 0 ? hp : 0
}
