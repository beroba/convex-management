import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import {DateTable} from './type'

/**
 * 日付テーブルを設定する
 * @param arg 開始日の日付
 */
export const Update = async (arg: string) => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 引数がある場合は日付を更新
  if (arg !== '/cb manage set days') await setDate(arg, sheet)

  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.DATE_CELLS)

  // スプレッドシートからボステーブルを作成する
  const table: DateTable[] = PiecesEach(cells, 3)
    .filter(util.Omit)
    .map(v => ({
      num: v[0],
      day: parseZero(v[1]),
      col: v[2],
    }))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.DAYS_TABLE, table)
}

/**
 * クランバトルの日付を引数に渡された開始日から設定する
 * @param arg 開始日の日付
 * @param sheet 情報のシート
 */
const setDate = async (arg: string, sheet: any) => {
  // 開始日から順番に日付の配列を作成
  const days = Array.from(Array(5), (_, i) => `${arg.split('/')[0]}/${Number(arg.split('/')[1]) + i}`)

  await Promise.all(
    // 日付を更新
    days.map(async (d, i) => {
      const cell = await sheet.getCell(`${Settings.INFORMATION_SHEET.DATE_COLUMN}${i + 3}`)
      await cell.setValue(d)
    })
  )
}

/**
 * 日付の0をパースして返す
 * @param d 整形前の日付
 * @return 整形後の日付
 */
const parseZero = (d: string) => d.split('/').map(Number).join('/')

/**
 * キャルステータスから日付テーブルを取得
 * @return 日付テーブル
 */
export const Fetch = async (): Promise<DateTable[]> => io.Fetch<DateTable[]>(Settings.CAL_STATUS_ID.DAYS_TABLE)

/**
 * クラバトの日付情報を取得する。
 * クラバトの日でない場合、練習日を返す
 * @return 日付の情報
 */
export const TakeDate = async (): Promise<DateTable> => {
  const table = await Fetch()

  // クラバトの日を取得
  const date: Option<DateTable> = table.find(d => d.day === mmdd())

  // クラバトの日でなければ練習日を返す
  return date ? date : table[5]
}

/**
 * プリコネ内の日付を`MM/DD`の形式で返す。
 * 5時より前の場合前の日扱いする
 * @return 現在の日付
 */
const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate() - (d.getHours() < 5 ? 1 : 0)}`)(new Date())
