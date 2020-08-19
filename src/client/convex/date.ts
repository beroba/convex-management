import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 今日のクラバトがn日目なのか返す
 * @return n日目かの値
 */
export const GetDay = async (): Promise<Option<string>> => {
  const cell = await checkCalnBattle()
  return cell ? cell[0] : null
}

/**
 * 指定された右隣の列名を取得
 * @param n 何個目かの数字
 * @return 列名
 */
export const GetColumn = async (n: number): Promise<string> => {
  const cell = await checkCalnBattle()
  return String.fromCharCode(cell[2].charCodeAt(0) + n)
}

/**
 * クラバトがあるかを確認する。
 * あった場合は日付の情報を返す
 * @return 日付の情報
 */
const checkCalnBattle = async () => {
  /**
   * 現在の日付を`MM/DD`の形式で返す
   * @return 現在の日付
   */
  const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate()}`)(new Date())

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.DATE_CELLS)

  // クラバトの日かどうか確認
  return util
    .PiecesEach(cells, 3)
    .map(v => [v[0], v[1].split('/').map(Number).join('/'), v[2]])
    .filter(v => v[1] === mmdd())[0]
}
