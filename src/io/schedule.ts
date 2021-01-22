import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as io from '.'
import {Plan} from './type'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'
import Option from 'type-of-option'

/**
 * 凸予定を追加する
 * @param 追加する予定
 */
export const Add = async (plan: Plan) => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 凸予定を追加
  plans.push(plan)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)
}

/**
 * 渡されたidの凸予定を削除する
 * @param id 削除したい凸予定のid
 * @return 削除したPlanの値
 */
export const Delete = async (id: string): Promise<Option<Plan>> => {
  // 凸予定一覧を取得
  let plans = await Fetch()

  // 一致する凸予定がない場合は終了
  const plan = plans.find(p => p.senderID === id)
  if (!plan) return

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.filter(p => p.senderID !== id)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)

  return plan
}

/**
 * 渡されたidの凸予定のメッセージを編集する
 * @param text 変更するテキスト
 * @param id 変更したいの凸予定のid
 */
export const Edit = async (text: string, id: string) => {
  // 凸予定一覧を取得s
  let plans = await Fetch()

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.map(p => {
    // 一致する凸予定以外はそのまま帰す
    if (p.senderID !== id) return p

    // メッセージを変更して返す
    p.msg = text
    return p
  })

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)
}

/**
 * キャルステータスからメンバーの状態を取得する
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Plan[]> => io.Fetch<Plan[]>(Settings.CAL_STATUS_ID.PLANS)

/**
 * 渡されたボス番号の凸予定一覧を取得する
 * @param alpha ボス番号
 */
export const FetchBoss = async (alpha: string): Promise<Plan[]> => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 特定のボス番号の値だけ返す
  return plans.filter(p => p.alpha === alpha)
}

/**
 * スプレッドシートに凸予定を追加する
 * @param 追加する予定
 */
export const AddToSheet = async (plan: Plan) => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)

  // スプレッドシートから凸予定一覧を取得
  const plans = await fetchPlansFromSheet(sheet)

  // 凸予定を追加
  await Promise.all(
    Object.values(plan).map(async (v, i) => {
      const cell = await sheet.getCell(`${AtoA('A', i)}${plans.length + 3}`)
      await cell.setValue(v)
    })
  )
}

/**
 * 渡されたidの凸予定をスプレッドシート上で削除する
 * @param id 削除したい凸予定のid
 */
export const DeleteOnSheet = async (id: string) => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)

  // スプレッドシートから凸予定一覧を取得
  const plans = await fetchPlansFromSheet(sheet)

  // 列,行を取得
  const col = Settings.PLAN_SHEET.DONE_COLUMN
  const row = plans.map(p => p.senderID).indexOf(id) + 3

  // idが存在しなければ終了
  if (row === 2) return

  // 値の更新
  const cell = await sheet.getCell(`${col}${row}`)
  cell.setValue('1')
}

/**
 * 渡されたidの凸予定のメッセージをスプレッドシート上で編集する
 * @param text 変更するテキスト
 * @param id 変更したいの凸予定のid
 */
export const EditOnSheet = async (text: string, id: string) => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)

  // スプレッドシートから凸予定一覧を取得
  const plans = await fetchPlansFromSheet(sheet)

  // 列,行を取得
  const col = Settings.PLAN_SHEET.MESSAGE_COLUMN
  const row = plans.map(p => p.senderID).indexOf(id) + 3

  // idが存在しなければ終了
  if (row === 2) return

  // 値の更新
  const cell = await sheet.getCell(`${col}${row}`)
  cell.setValue(text)
}

/**
 * スプレッドシートの凸予定をキャルに反映させる
 */
export const ReflectOnCal = async () => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)

  // スプレッドシートから凸予定一覧を取得
  const plans = await fetchPlansFromSheet(sheet)
  const incomplete = plans.filter(p => !p.done)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, incomplete)
}

/**
 * 凸予定のシートから凸予定一覧を取得する
 * @param sheet 凸予定のシート
 * @return 凸予定一覧
 */
const fetchPlansFromSheet = async (sheet: any): Promise<Plan[]> => {
  const cells = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)
  return PiecesEach(cells, 9)
    .filter(util.Omit)
    .map(p => ({
      done: p[0],
      senderID: p[1],
      calID: p[2],
      name: p[3],
      playerID: p[4],
      num: p[5],
      alpha: p[6],
      boss: p[7],
      msg: p[8],
    }))
}
