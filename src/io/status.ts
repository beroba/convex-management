import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as dateTable from './dateTable'
import {User, Member} from './type'

/**
 * キャルステータスのメンバーの状態を更新する
 * @param members メンバー一覧
 */
export const Update = async (members: Member[]) => {
  // 10個ずつに分割
  PiecesEach(members, 10).forEach(async (m, i) => {
    // キャルステータスを更新
    await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS[i], m)
  })
}

/**
 * メンバー個々の状態を設定する
 * @param メンバー情報
 * @return メンバー一覧
 */
export const UpdateMember = async (member: Member): Promise<Member[]> => {
  // メンバー全体の状態を取得
  let members = await Fetch()

  // メンバーの状態を更新
  members = members.map(s => (s.id === member.id ? member : s))

  // キャルステータスを更新
  await Update(members)

  return members
}

/**
 * メンバー全員の状態の名前とidを設定する
 * @param ユーザー情報
 */
export const UpdateUsers = async (users: Option<User[]>) => {
  const members: Option<Member[]> = users?.map(u => ({
    name: u.name,
    id: u.id,
    limit: '',
    declare: '',
    carry: false,
    convex: 3,
    over: 0,
    end: '',
    history: '',
  }))

  if (!members) return

  // キャルステータスを更新
  await Update(members)
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
  // メンバー全体の状態を取得
  let members = await Fetch()

  // 全員の凸状況をリセット
  members = members.map(s => ({
    name: s.name,
    id: s.id,
    limit: s.limit,
    declare: '',
    carry: false,
    convex: 3,
    over: 0,
    end: '',
    history: '',
  }))

  // キャルステータスを更新
  await Update(members)
}

/**
 * メンバー全員の凸宣言をリセットする
 */
export const ResetDeclare = async () => {
  // メンバー全体の状態を取得
  let members = await Fetch()

  // 全員の凸状況をリセット
  members = members.map(s => ({
    name: s.name,
    id: s.id,
    limit: s.limit,
    declare: '',
    carry: false,
    convex: s.convex,
    over: s.over,
    end: s.end,
    history: s.history,
  }))

  // キャルステータスを更新
  await Update(members)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Member[]> => {
  // メンバーの状態を全て取得
  const m1 = await io.Fetch<Member[]>(Settings.CAL_STATUS_ID.MEMBERS[0])
  const m2 = await io.Fetch<Member[]>(Settings.CAL_STATUS_ID.MEMBERS[1])
  const m3 = await io.Fetch<Member[]>(Settings.CAL_STATUS_ID.MEMBERS[2])
  // 結合して返す
  return m1.concat(m2).concat(m3)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const FetchMember = async (id: string): Promise<Option<Member>> => {
  // メンバー全体の状態を取得
  const members = await Fetch()

  // メンバーが存在しない場合はundefinedを返す
  const member = members.filter(s => s.id === id)
  return member.length === 0 ? undefined : member.first()
}

/**
 * スプレッドシートにメンバーの凸状況を反映させる
 */
export const ReflectOnSheet = async () => {
  // メンバー全体の状態を取得
  const members = await Fetch()

  // 情報のシートを取得
  const info = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await FetchUserFromSheet(info)

  // 列を取得
  const col = (await dateTable.TakeDate()).col

  for (const m of members) {
    // 行を取得
    const row = users.map(u => u.id).indexOf(m.id) + 3

    // 凸数、持越、3凸終了、履歴を更新する
    let i = 0
    for (const v of [m.convex, m.over, m.end, m.history]) {
      const cell = await sheet.getCell(`${AtoA(col, i++)}${row}`)
      await cell.setValue(v)
      await util.Sleep(100)
    }
  }
}

/**
 * メンバーの活動限界時間を反映させる
 * @param member 更新したいメンバー
 */
export const ReflectOnLimit = async (member: Member) => {
  // 情報のシートを取得
  const info = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await FetchUserFromSheet(info)

  // 行と列を取得
  const col = Settings.INFORMATION_SHEET.LIMIT_COLUMN
  const row = users.map(u => u.id).indexOf(member.id) + 3

  // 活動限界時間を更新する
  const cell = await info.getCell(`${col}${row}`)
  await cell.setValue(member.limit)
}

/**
 * スプレッドシートの凸状況をリセットする
 */
export const ResetConvexOnSheet = async () => {
  // メンバー全体の状態を取得
  const state = await Fetch()

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 列を取得
  const col = (await dateTable.TakeDate()).col

  for (const j of util.range(state.length)) {
    // 行を取得
    const row = j + 3

    // 凸数、持越、3凸終了、履歴をリセットする
    for (const i of util.range(4)) {
      const cell = await sheet.getCell(`${AtoA(col, i)}${row}`)
      await cell.setValue(i ? '' : '3')
      await util.Sleep(100)
    }
  }
}

/**
 * 凸状況のシートからユーザー一覧を取得する
 * @param sheet 凸状況のシート
 * @return ユーザー一覧
 */
export const FetchUserFromSheet = async (sheet: any): Promise<User[]> => {
  // メンバー全体の状態を取得
  const members = await Fetch()

  const cells = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.MEMBER_CELLS)
  return PiecesEach(cells, 3)
    .filter(util.Omit)
    .map(u => {
      const id = u[1]
      const member = members.find(m => m.id === id)
      return {
        name: u[0],
        id: id,
        limit: u[2],
        declare: member?.declare ?? '',
        carry: false,
      }
    })
}
