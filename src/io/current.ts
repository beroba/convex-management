import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as bossTable from './bossTable'
import {AtoE, Current, CurrentBoss} from './type'

/**
 * 現在の状況の段階と周回数を設定する
 * @param state 現在の状況
 * @param lap 周回数
 * @return 現在の状況
 */
export const UpdateLap = async (state: Current, lap: number): Promise<Current> => {
  // 値を更新
  state.lap = lap
  state.stage = getStageName(lap)

  // キャルステータスを更新する
  await io.UpdateJson(Settings.CAL_STATUS_ID.CURRENT, state)

  return state
}

/**
 * 現在の周回数から段階名を返す
 * @param lap 周回数
 * @return 段階名
 */
const getStageName = (lap: number): string => {
  switch (true) {
    case lap < Settings.STAGE.SECOND.LAP.first():
      return 'FIRST'
    case lap < Settings.STAGE.THIRD.LAP.first():
      return 'SECOND'
    case lap < Settings.STAGE.FOURTH.LAP.first():
      return 'THIRD'
    case lap < Settings.STAGE.FIFTH.LAP.first():
      return 'FOURTH'
    default:
      return 'FIFTH'
  }
}

/**
 * 現在のボス状況を設定する
 * @param hp 残りHP
 * @param alpha ボス番号
 * @param state 現在の状況
 * @return 現在の状況
 */
export const UpdateBoss = async (hp: number, alpha: AtoE, state: Current): Promise<Current> => {
  // ボス番号(英語)からボス番号(数字)とボス名を取得
  const num = (await bossTable.TakeNum(alpha)) ?? ''
  const name = (await bossTable.TakeName(alpha)) ?? ''

  // HPが0以下の場合0にする
  hp = hp < 0 ? 0 : hp

  // ボス状況を更新
  state[alpha] = {
    alpha: alpha,
    num: num,
    name: name,
    hp: hp,
    subjugate: !hp,
  } as CurrentBoss

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
 * @param state 現在の状況
 */
export const ReflectOnSheet = async (state: Current) => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数、討伐状況、HPの番地を取得
  const lap = Settings.INFORMATION_SHEET.LAP_CELL
  const subjugate = Settings.INFORMATION_SHEET.SUBJUGATE_CELLS
  const hp = Settings.INFORMATION_SHEET.HP_CELLS

  // 周回数を更新
  const lap_cell = await sheet.getCell(lap)
  await lap_cell.setValue(state.lap)

  // 討伐状況を更新
  await Promise.all(
    subjugate.split(',').map(async (c: string, i: number) => {
      const alpha = AtoA('a', i) as AtoE
      const subjugate_cell = await sheet.getCell(c)
      subjugate_cell.setValue(state[alpha].subjugate)
    })
  )

  // HPを更新
  await Promise.all(
    hp.split(',').map(async (c: string, i: number) => {
      const alpha = AtoA('a', i) as AtoE
      const hp_cell = await sheet.getCell(c)
      hp_cell.setValue(state[alpha].hp)
    })
  )
}

/**
 * スプレッドの現在の状況をキャルに反映させる
 */
export const ReflectOnCal = async () => {
  // 現在の状況を取得
  const state = await Fetch()

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数、討伐状況、HPの番地を取得
  const lap_cell = Settings.INFORMATION_SHEET.LAP_CELL
  const hp_cell = Settings.INFORMATION_SHEET.HP_CELLS

  // 周回数を更新
  const lap = (await sheet.getCell(lap_cell)).getValue()
  await UpdateLap(state, Number(lap))

  // 現在のボスを更新
  await Promise.all(
    hp_cell.map(async (cell: string, i: number) => {
      const alpha = AtoA('a', i) as AtoE
      const hp = (await sheet.getCell(cell)).getValue()
      await UpdateBoss(hp, alpha, state)
    })
  )
}
