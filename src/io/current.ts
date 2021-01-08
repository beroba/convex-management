import Settings from 'const-settings'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as bossTable from './bossTable'
import {Current} from './type'

/**
 * 現在の状況の段階と周回数を設定する
 * @param lap 周回数
 */
export const UpdateLap = async (lap: string) => {
  // キャルステータスから現在の状況を取得
  const json: Current = await Fetch()

  // 値を更新
  json.stage = GetStageName(lap)
  json.lap = lap

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, json)
}

/**
 * 現在の周回数から段階名を返す
 * @param lap 周回数
 * @return 段階名
 */
export const GetStageName = (lap: string): string => {
  const l = Number(lap)
  switch (true) {
    case l < 4:
      return 'first'
    case l < 11:
      return 'second'
    case l < 35:
      return 'third'
    case l < 45:
      return 'fourth'
    default:
      return 'fifth'
  }
}

/**
 * 現在の状況のボス名とボス番号を設定する
 * @param alpha ボス番号
 */
export const UpdateBoss = async (alpha: string) => {
  // キャルステータスから現在の状況を取得
  const json: Current = await Fetch()

  // 値を更新
  json.alpha = alpha
  const num = await bossTable.TakeNum(alpha)
  if (!num) return
  json.num = num
  const boss = await bossTable.TakeName(alpha)
  if (!boss) return
  json.boss = boss

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, json)
}

/**
 * 現在の状況のボスhpを設定する
 * @param hp ボスhp
 */
export const UpdateHp = async (hp: string) => {
  // キャルステータスから現在の状況を取得
  const json: Current = await Fetch()

  // 値を更新
  json.hp = hp

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, json)
}

/**
 * キャルステータスから現在の状況を取得
 * @return 現在の状況
 */
export const Fetch = async (): Promise<Current> => io.Fetch<Current>(Settings.CAL_STATUS_ID.CURRENT)

/**
 * 現在の状況を更新する
 */
export const SetCells = async () => {
  // キャルステータスから現在の状況を取得
  const json: Current = await Fetch()

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数、ボス名、ボス番号の番地を取得
  const [lap, boss, alpha] = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')

  // 周回数を更新する
  const lap_cell = await sheet.getCell(lap)
  lap_cell.setValue(json.lap)

  // ボス名を更新する
  const boss_cell = await sheet.getCell(boss)
  boss_cell.setValue(json.boss)

  // ボス番号を更新する
  const alpha_cell = await sheet.getCell(alpha)
  alpha_cell.setValue(json.alpha)
}
