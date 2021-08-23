import Option from 'type-of-option'
import * as io from '.'
import * as json from './json'
import {AtoE, BossTable} from './type'

/**
 * ボステーブルを設定する
 */
export const Update = async () => {
  // ボス情報のJsonを取得
  const list = await json.Fetch('boss')

  // スプレッドシートからボステーブルを作成する
  const table: BossTable[] = 'abcde'.split('').map((a, i) => ({
    num: `${i + 1}`,
    alpha: a as AtoE,
    name: list[a],
  }))

  // キャルステータスを更新する
  await io.UpdateArray('bossTable', table)
}

/**
 * キャルステータスからボステーブルを取得
 * @return ボステーブル
 */
export const Fetch = async (): Promise<BossTable[]> => io.Fetch<BossTable[]>('bossTable')

/**
 * ボス番号からボス名を取得
 * @param alpha ボス番号
 * @return ボス名
 */
export const TakeName = async (alpha: string): Promise<Option<string>> => {
  // ボステーブルを取得
  const table = await Fetch()

  // ボス番号がない場合は終了
  const boss = table.find(t => t.alpha === alpha)
  if (!boss) return

  // ボス名を返す
  return boss.name
}

/**
 * ボス名からボス番号を取得
 * @param name ボス名
 * @return ボス番号
 */
export const TakeAlpha = async (name: string): Promise<Option<string>> => {
  // ボステーブルを取得
  const table = await Fetch()

  // ボス名がない場合は終了
  const boss = table.find(t => t.name === name)
  if (!boss) return

  // ボス番号を返す
  return boss.alpha
}

/**
 * ボス番号からボス番号を取得
 * @param alpha ボス番号
 * @return ボス番号
 */
export const TakeNum = async (alpha: string): Promise<Option<string>> => {
  // ボステーブルを取得
  const table = await Fetch()

  // ボス名がない場合は終了
  const boss = table.find(t => t.alpha === alpha)
  if (!boss) return

  // ボス番号を返す
  return boss.num
}
