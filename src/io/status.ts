import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import Option from 'type-of-option'
import * as spreadsheet from '../util/spreadsheet'
import * as io from './'
import {BossTable} from './type'

/**
 * ボステーブルを設定する
 * @param msg DiscordからのMessage
 */
export const UpdateBossTable = async () => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  // スプレッドシートからボステーブルを作成する
  const bossTable: BossTable[] = PiecesEach(cells, 2)
    .filter(v => !/^,+$/.test(v.toString()))
    .map(v => ({
      num: v[0],
      alpha: v[1],
      name: v[2],
    }))

  // キャルステータスを更新する
  await io.Update(Settings.CAL_STATUS_ID.BOSSTABLE, bossTable)
}

/**
 * キャルステータスからボステーブルを取得
 * @return ボステーブル
 */
export const FetchBossTable = async (): Promise<BossTable[]> => io.Fetch<BossTable[]>(Settings.CAL_STATUS_ID.BOSSTABLE)

/**
 * ボス番号からボス名を取得
 * @param alpha ボス番号
 * @return ボス名
 */
export const TakeBossName = async (alpha: string): Promise<Option<string>> => {
  // キャルステータスからボステーブルを取得
  const bossTable = await FetchBossTable()

  // ボス番号がない場合は終了
  const boss = bossTable.filter(t => t.alpha === alpha)
  if (boss.length === 0) return

  // ボス名を返す
  return boss[0].name
}

/**
 * ボス名からボス番号を取得
 * @param name ボス名
 * @return ボス番号
 */
export const TakeBossAlpha = async (name: string): Promise<Option<string>> => {
  // キャルステータスからボステーブルを取得
  const bossTable = await FetchBossTable()

  // ボス名がない場合は終了
  const boss = bossTable.filter(t => t.name === name)
  if (boss.length === 0) return

  // ボス番号を返す
  return boss[0].alpha
}
