import Option from 'type-of-option'
import * as util from '../util'
import {DateTable} from '../util/type'

/**
 * 今月のクラバトの日付テーブルを作成
 */
export const Create = (): DateTable[] => {
  const d = new Date()
  const [year, month] = [d.getFullYear(), d.getMonth() + 1]

  // 今月の最終日を取得
  const last = new Date(year, month, 0).getDate()
  return util.Range(1, 6).map(i => ({num: `${i}日目`, day: `${month}/${last - 6 + i}`}))
}

/**
 * クラバトの日付情報を取得する。
 * クラバトの日でない場合、練習日を返す
 * @return 日付の情報
 */
export const TakeDate = async (): Promise<DateTable> => {
  const table = Create()

  // クラバトの日を取得
  const date: Option<DateTable> = table.find(d => d.day === mmdd())

  // クラバトの日でなければ練習日を返す
  return date || {num: '練習日', day: '0/0'}
}

/**
 * プリコネ内の日付を`MM/DD`の形式で返す。
 * 5時より前の場合、前の日扱いする
 * @return 現在の日付
 */
const mmdd = (): string => {
  const d = new Date()
  // 5時より前の場合、前の日扱いする
  return `${d.getMonth() + 1}/${d.getDate() - (d.getHours() < 5 ? 1 : 0)}`
}
