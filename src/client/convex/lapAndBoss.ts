import Settings from 'const-settings'
import * as spreadsheet from '../../util/spreadsheet'
import * as util from '../../util'

type Current = {
  lap: string
  boss: string
  num: string
}

/**
 * 現在の周回数とボスを変更する
 * @param arg 変更したい周回数とボス番号
 * @return Updateしたかの真偽値
 */
export const Update = async (arg: string): Promise<boolean> => {
  // 周回数とボス番号を取得
  const [lap, num] = arg.replace(/　/g, ' ').split(' ')

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return false
  if (!/[a-e]|[A-E]/.test(num)) return false

  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const boss = await readBossName(infoSheet, num)

  // 現在の周回数とボスを更新
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(infoSheet)
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  progressReport()

  return true
}

/**
 * 現在の周回数とボスを次に進める
 */
export const Next = async () => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(infoSheet)
  const [lap, boss, num] = await readForwardDate(lap_cell, num_cell, infoSheet)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  progressReport()
}

/**
 * 現在の周回数とボスを前に戻す
 */
export const Previous = async () => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(infoSheet)
  const [lap, boss, num] = await readReturnDate(lap_cell, num_cell, infoSheet)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  progressReport()
}

/**
 * 現在の周回数とボスをオブジェクトで返す
 * @return 現在の周回数とボス
 */
export const GetCurrent = async (): Promise<Current> => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 範囲を指定して現在の周回数とボスを取得
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [lap, boss] = await spreadsheet.GetCells(infoSheet, `${range[0]}:${range[1]}`)

  // ボス番号の取得
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  const num = util.PiecesEach(cells, 2).filter(v => v[1] === boss)[0][0]

  return {lap: lap, boss: boss, num: num}
}

/**
 * 情報シートから現在のボスの名前を取得する
 * @param infoSheet 情報のシート
 * @param num ボスの番号
 * @return ボスの名前
 */
const readBossName = async (infoSheet: any, num: string): Promise<string> => {
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  return util.PiecesEach(cells, 2).filter(v => v[0] === num.toLowerCase())[0][1]
}

/**
 * 現在の周回数とボスを#進行に報告
 */
const progressReport = async () => {
  // 現在の周回数とボスを取得
  const state = await GetCurrent()

  // ボスのロールを取得
  const num = state.num.charCodeAt(0) - 97
  const role = Settings.BOSS_ROLE_ID[Number(num)]

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${role}> \`${state.lap}\`周目の\`${state.boss}\``)
}

/**
 * 情報シートの現在の周回数とボスのセルを取得する
 * @param infoSheet 情報のシート
 * @return セルの一覧
 */
const readCurrentCell = (infoSheet: any): any[] =>
  Settings.INFORMATION_SHEET.CURRENT_CELL.split(',').map((cell: string) => infoSheet.getCell(cell))

/**
 * 情報シートの現在の周回数とボスから次に進める値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @param infoSheet 情報のシート
 * @return 設定する値
 */
const readForwardDate = async (lap_cell: any, num_cell: any, infoSheet: any): Promise<[number, string, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 4 ? 0 : n + 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const boss = await readBossName(infoSheet, numberList[n])
  return [n ? lap : Number(lap) + 1, boss, numberList[n]]
}

/**
 * 情報シートの現在の周回数とボスから前に戻す値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @param infoSheet 情報のシート
 * @return 設定する値
 */
const readReturnDate = async (lap_cell: any, num_cell: any, infoSheet: any): Promise<[number, string, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 0 ? 4 : n - 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const boss = await readBossName(infoSheet, numberList[n])
  return [n === 4 ? Number(lap) - 1 : lap, boss, numberList[n]]
}
