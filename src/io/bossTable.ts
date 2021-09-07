import Option from 'type-of-option'
import * as io from './redis'
import * as json from './json'
import {AtoE, BossTable} from '../util/type'

/**
 * ボステーブルを設定する
 * @return 値がなかった場合のエラー
 */
export const Update = async (): Promise<Option<Error>> => {
  // ボス情報をキャルステータスから取得
  const list = await json.Fetch('boss')
  if (!list) return Error()

  // ボステーブルを作成
  const table: BossTable[] = 'abcde'.split('').map((a, i) => ({
    num: `${i + 1}`,
    alpha: a as AtoE,
    name: list[a],
  }))

  await io.UpdateArray('bossTable', table)
}

/**
 * キャルステータスからボステーブルを取得
 * @return ボステーブル
 */
export const Fetch = async (): Promise<BossTable[]> => {
  return io.Fetch<BossTable[]>('bossTable')
}

/**
 * ボス番号からボス名を取得
 * @param alpha ボス番号
 * @return ボス名
 */
export const TakeName = async (alpha: string): Promise<Option<string>> => {
  const table = await Fetch()

  const boss = table.find(t => t.alpha === alpha)
  if (!boss) return

  return boss.name
}

/**
 * ボス名からボス番号を取得
 * @param name ボス名
 * @return ボス番号
 */
export const TakeAlpha = async (name: string): Promise<Option<string>> => {
  const table = await Fetch()

  const boss = table.find(t => t.name === name)
  if (!boss) return

  return boss.alpha
}

/**
 * ボス番号からボス番号を取得
 * @param alpha ボス番号
 * @return ボス番号
 */
export const TakeNum = async (alpha: string): Promise<Option<string>> => {
  const table = await Fetch()

  const boss = table.find(t => t.alpha === alpha)
  if (!boss) return

  return boss.num
}
