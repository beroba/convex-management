import Option from 'type-of-option'
import * as util from '../util'
import * as io from '.'
import {DateTable} from './type'

/**
 * 日付テーブルを設定する
 * @param args 開始日の日付
 */
export const Update = async (args: string) => {
  // 開始日から順番に日付の配列を作成
  const days = util.Range(5).map(i => `${args.split('/').first()}/${args.split('/').last().to_n() + i}`)

  // スプレッドシートからボステーブルを作成する
  const table: DateTable[] = days.map((d, i) => ({
    num: `${i + 1}日目`,
    day: d.split('/').map(Number).join('/'),
  }))

  // キャルステータスを更新する
  await io.UpdateArray('dateTable', table)
}

/**
 * キャルステータスから日付テーブルを取得
 * @return 日付テーブル
 */
export const Fetch = async (): Promise<DateTable[]> => io.Fetch<DateTable[]>('dateTable')

/**
 * クラバトの日付情報を取得する。
 * クラバトの日でない場合、練習日を返す
 * @return 日付の情報
 */
export const TakeDate = async (): Promise<DateTable> => {
  // 日付テーブルを取得
  const table = await Fetch()

  // クラバトの日を取得
  const date: Option<DateTable> = table.find(d => d.day === mmdd())

  // クラバトの日でなければ練習日を返す
  return date || {num: '練習日', day: '0/0'}
}

/**
 * プリコネ内の日付を`MM/DD`の形式で返す。
 * 5時より前の場合前の日扱いする
 * @return 現在の日付
 */
const mmdd = (): string => {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate() - (d.getHours() < 5 ? 1 : 0)}`
}
