import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {NtoA} from 'alphabet-to-number'
import * as bossTable from '../../io/bossTable'
import * as current from '../../io/current'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 現在の周回数とボスを変更する
 * @param arg 変更したい周回数とボス番号
 * @return Updateしたかの真偽値
 */
export const Update = async (arg: string): Promise<boolean> => {
  // 周回数とボス番号を取得
  const [lap, alpha] = arg.replace(/　/g, ' ').split(' ')

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return false
  if (!/[a-e]/i.test(alpha)) return false

  // 現在の状況を更新
  await current.UpdateLap(lap)
  await util.sleep(100)
  await current.UpdateBoss(alpha)
  await util.sleep(100)

  // 現在の状況をスプレッドシートに反映
  current.SetCells()

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 段階数の区切りを付ける
  // stageConfirm()

  return true
}

/**
 * 現在の周回数とボスを次に進める
 */
export const Next = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(sheet)
  const [lap, boss, num] = await readForwardDate(lap_cell, num_cell)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 段階数の区切りを付ける
  stageConfirm()
}

/**
 * 現在の周回数とボスを前に戻す
 */
export const Previous = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(sheet)
  const [lap, boss, num] = await readReturnDate(lap_cell, num_cell)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 段階数の区切りを付ける
  stageConfirm()
}

/**
 * #進行に現在の周回数とボスを報告
 */
export const ProgressReport = async () => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // ボスのロールを取得
  const role = Settings.BOSS_ROLE_ID[state.alpha]

  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${role}>\n\`${state.lap}\`周目 \`${state.boss}\``)
}

/**
 * 情報シートの現在の周回数とボスのセルを取得する
 * @param sheet 情報のシート
 * @return セルの一覧
 */
const readCurrentCell = (sheet: any): any[] =>
  Settings.INFORMATION_SHEET.CURRENT_CELL.split(',').map((cell: string) => sheet.getCell(cell))

/**
 * 情報シートの現在の周回数とボスから次に進める値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @return 設定する値
 */
const readForwardDate = async (lap_cell: any, num_cell: any): Promise<[number, Option<string>, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 4 ? 0 : n + 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const name = await bossTable.TakeName(NtoA(n))
  return [n ? lap : Number(lap) + 1, name, numberList[n]]
}

/**
 * 情報シートの現在の周回数とボスから前に戻す値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @param sheet 情報のシート
 * @return 設定する値
 */
const readReturnDate = async (lap_cell: any, num_cell: any): Promise<[number, Option<string>, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 0 ? 4 : n - 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const name = await bossTable.TakeName(NtoA(n))
  return [n === 4 ? Number(lap) - 1 : lap, name, numberList[n]]
}

/**
 * 段階が切り替わるか確認をする
 */
const stageConfirm = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数とボス番号を取得
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [lap, , num] = await spreadsheet.GetCells(sheet, `${range[0]}:${range[2]}`)

  // キャルの段階ロールを切り替える
  const stage = getStageNow(Number(lap))
  switchStageRole(stage)

  // 1ボスない場合は終了
  if (num !== 'a') return

  // 段階数のセル
  const cells: string[][] = PiecesEach(await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.STAGE_CELLS), 2)
  const col = Settings.INFORMATION_SHEET.STAGE_COLUMN

  switch (lap) {
    case '4': {
      if (cells[1][1]) return
      return fetchStage(2, sheet, col)
    }

    case '11': {
      if (cells[2][1]) return
      return fetchStage(3, sheet, col)
    }

    case '35': {
      if (cells[3][1]) return
      return fetchStage(4, sheet, col)
    }
  }
}

/**
 * 現在の周回数から段階名を返す
 * @param n 周回数
 * @return 段階名
 */
const getStageNow = (lap: number) => {
  switch (true) {
    case lap < 4:
      return 'first'
    case lap < 11:
      return 'second'
    case lap < 35:
      return 'third'
    case lap < 45:
      return 'fourth'
    default:
      return 'fifth'
  }
}

/**
 * キャルの段階ロールを切り替える
 * @param stage 段階名
 */
const switchStageRole = (stage: string) => {
  // キャルのユーザー情報を取得
  const cal = util.GetCalInfo()

  // 全ての段階ロールを外す
  Object.values(Settings.STAGE_ROLE_ID as string[]).forEach(id => cal?.roles.remove(id))

  // 現在の段階ロールを付ける
  cal?.roles.add(Settings.STAGE_ROLE_ID[stage])

  console.log("Switch Cal's stage role")
}

/**
 * 段階数の区切りとフラグを立てる
 * @param n 段階数
 * @param sheet 情報のシート
 * @param col フラグの列
 */
const fetchStage = async (n: number, sheet: any, col: string) => {
  const cell = await sheet.getCell(`${col}${n + 2}`)
  cell.setValue(1)
}
