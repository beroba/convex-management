import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import Option from 'type-of-option'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import {BossTable} from './type'

/**
 * ボステーブルを設定する
 */
export const Update = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  // スプレッドシートからボステーブルを作成する
  const table: BossTable[] = PiecesEach(cells, 2)
    .filter(v => !/^,+$/.test(v.toString()))
    .map(v => ({
      num: v[0],
      alpha: v[1],
      name: v[2],
    }))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.BOSS_TABLE, table)
}

/**
 * キャルステータスからボステーブルを取得
 * @return ボステーブル
 */
export const Fetch = async (): Promise<BossTable[]> => io.Fetch<BossTable[]>(Settings.CAL_STATUS_ID.BOSS_TABLE)

/**
 * ボス番号からボス名を取得
 * @param alpha ボス番号
 * @return ボス名
 */
export const TakeName = async (alpha: string): Promise<Option<string>> => {
  // キャルステータスからボステーブルを取得
  const table = await Fetch()

  // ボス番号がない場合は終了
  const boss = table.filter(t => t.alpha === alpha)
  if (boss.length === 0) return

  // ボス名を返す
  return boss[0].name
}

/**
 * ボス名からボス番号を取得
 * @param name ボス名
 * @return ボス番号
 */
export const TakeAlpha = async (name: string): Promise<Option<string>> => {
  // キャルステータスからボステーブルを取得
  const table = await Fetch()

  // ボス名がない場合は終了
  const boss = table.filter(t => t.name === name)
  if (boss.length === 0) return

  // ボス番号を返す
  return boss[0].alpha
}

/**
 * ボス番号からボス番号を取得
 * @param alpha ボス番号
 * @return ボス番号
 */
export const TakeNum = async (alpha: string): Promise<Option<string>> => {
  // キャルステータスからボステーブルを取得
  const table = await Fetch()

  // ボス名がない場合は終了
  const boss = table.filter(t => t.alpha === alpha)
  if (boss.length === 0) return

  // ボス番号を返す
  return boss[0].num
}
