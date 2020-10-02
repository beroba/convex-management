import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 今日のクラバトがn日目なのか返す
 * @return n日目かの値
 */
export const GetDay = async (): Promise<Option<string>> => {
  const cell = await CheckCalnBattle()
  return cell ? cell[0] : null
}

/**
 * クラバトがあるかを確認する。
 * あった場合は日付の情報を返す
 * @return 日付の情報
 */
export const CheckCalnBattle = async (): Promise<string[]> => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.DATE_CELLS)

  // クラバトの日かどうか確認
  return PiecesEach(cells, 3)
    .map(v => [v[0], v[1].split('/').map(Number).join('/'), v[2]])
    .filter(v => v[1] === mmdd())[0]
}

/**
 * プリコネ内の日付を`MM/DD`の形式で返す。
 * 5時より前の場合前の日扱いする
 * @return 現在の日付
 */
const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate() - (d.getHours() < 5 ? 1 : 0)}`)(new Date())
