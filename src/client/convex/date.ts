import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * クラバトの日付情報を取得する。
 * クラバトの日でない場合、練習日を返す
 * @return 日付の情報
 */
export const GetDay = async (): Promise<string[]> => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.DATE_CELLS)

  // 日付の0を取り除く
  const days: string[][] = PiecesEach(cells, 3).map(c => [c[0], c[1].split('/').map(Number).join('/'), c[2]])

  // クラバトの日を取得
  const day: Option<string[]> = days.find(d => d[1] === mmdd())

  // クラバトの日でなければ練習日を返す
  return day ? day : days[5]
}

/**
 * 指定した列と行のセルを取得する。
 * 列は右にどれだけずらすかを指定する
 * @param n 基準の列から右にずらす数、値がない場合は`0`
 * @param row 凸報告の行
 * @param sheet 凸報告のシート
 * @param days クラバトの日付情報
 * @return 取得したセル
 */
export const GetCell = async (n = 0, row: number, sheet: any, days: string[]): Promise<any> => {
  const col = AtoA(days[2], n)
  return sheet.getCell(`${col}${row}`)
}

/**
 * プリコネ内の日付を`MM/DD`の形式で返す。
 * 5時より前の場合前の日扱いする
 * @return 現在の日付
 */
const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate() - (d.getHours() < 5 ? 1 : 0)}`)(new Date())
