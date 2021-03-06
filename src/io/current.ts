import Settings from 'const-settings'
import Option from 'type-of-option'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as bossTable from './bossTable'
import {Current} from './type'

/**
 * 現在の状況の段階と周回数を設定する
 * @param lap 周回数
 * @param alpha ボス番号
 */
export const UpdateLapAndBoss = async (lap: string, alpha: string): Promise<Option<Current>> => {
  // 現在の状況を取得
  const state: Current = await Fetch()

  // 値を更新
  state.lap = lap
  state.stage = getStageName(lap)
  state.alpha = alpha

  const num = await bossTable.TakeNum(alpha)
  if (!num) return
  state.num = num

  const boss = await bossTable.TakeName(alpha)
  if (!boss) return
  state.boss = boss

  state.hp = Settings.STAGE[state.stage].HP[alpha]

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, state)

  return state
}

/**
 * 現在の周回数から段階名を返す
 * @param lap 周回数
 * @return 段階名
 */
const getStageName = (lap: string): string => {
  const l = Number(lap)
  switch (true) {
    case l < Settings.STAGE.SECOND.LAP.first():
      return 'FIRST'
    case l < Settings.STAGE.THIRD.LAP.first():
      return 'SECOND'
    case l < Settings.STAGE.FOURTH.LAP.first():
      return 'THIRD'
    case l < Settings.STAGE.FIFTH.LAP.first():
      return 'FOURTH'
    default:
      return 'FIFTH'
  }
}

/**
 * 現在の状況のボスhpを設定する
 * @param hp ボスhp
 */
export const UpdateBossHp = async (hp: string): Promise<Current> => {
  // 現在の状況を取得
  const state: Current = await Fetch()

  // 値を更新
  state.hp = hp

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, state)

  return state
}

/**
 * キャルステータスから現在の状況を取得
 * @return 現在の状況
 */
export const Fetch = async (): Promise<Current> => io.Fetch<Current>(Settings.CAL_STATUS_ID.CURRENT)

/**
 * スプレッドシートに現在の状況を反映させる
 */
export const ReflectOnSheet = async () => {
  // 現在の状況を取得
  const state: Current = await Fetch()

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数、ボス名、ボス番号の番地を取得
  const [lap, boss, alpha] = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')

  // 周回数を更新
  const lap_cell = await sheet.getCell(lap)
  lap_cell.setValue(state.lap)

  // ボス名を更新
  const boss_cell = await sheet.getCell(boss)
  boss_cell.setValue(state.boss)

  // ボス番号を更新
  const alpha_cell = await sheet.getCell(alpha)
  alpha_cell.setValue(state.alpha)
}

/**
 * スプレッドの現在の状況をキャルに反映させる
 */
export const ReflectOnCal = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数、ボス名、ボス番号の番地を取得
  const [lap_cell, , alpha_cell] = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')

  // 周回数を更新
  const lap = (await sheet.getCell(lap_cell)).getValue()
  const alpha = (await sheet.getCell(alpha_cell)).getValue()

  // 現在の状況を更新
  await UpdateLapAndBoss(lap, alpha)
}
