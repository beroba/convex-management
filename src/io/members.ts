import Settings from 'const-settings'
import Option from 'type-of-option'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as io from '.'
import * as dateTable from './dateTable'
import {Member, User} from './type'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'

/**
 * メンバー個々の状態を設定する
 * @param メンバー情報
 */
export const UpdateMember = async (member: Member) => {
  const state = await Fetch()
  const members = state.map(s => (s.id === member.id ? member : s))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS, members)
}

/**
 * メンバー全員の状態の名前とidを設定する
 * @param ユーザー情報
 */
export const UpdateUsers = async (users: Option<User[]>) => {
  const members: Option<Member[]> = users?.map(u => ({
    name: u.name,
    id: u.id,
    convex: '',
    over: '',
    end: '',
    history: '',
  }))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS, members)
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
  const state = await Fetch()
  const members: Member[] = state.map(s => ({
    name: s.name,
    id: s.id,
    convex: '',
    over: '',
    end: '',
    history: '',
  }))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS, members)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Member[]> => io.Fetch<Member[]>(Settings.CAL_STATUS_ID.MEMBERS)

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const FetchMember = async (id: string): Promise<Option<Member>> => {
  const state = await Fetch()
  const member = state.filter(s => s.id === id)
  return member.length === 0 ? undefined : member[0]
}

/**
 * スプレッドシートにメンバーの凸状況を反映させる
 * @param 更新したいメンバー
 */
export const ReflectOnSheet = async (member: Member) => {
  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)
  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => !/^,+$/.test(v.toString()))

  // 行と列を取得
  const col = (await dateTable.TakeDate()).col
  const row = members.map(v => v[1]).indexOf(member.id) + 3

  // 凸数、持ち越し、3凸終了、履歴を更新する
  Promise.all(
    // prettier-ignore
    [
      member.convex,
      member.over,
      member.end,
      member.history
    ].map(async (v, i) => {
      const cell = await sheet.getCell(`${AtoA(col, i)}${row}`)
      await cell.setValue(v)
    })
  )
}

/**
 * スプレッドシートの凸状況をキャルに反映させる
 */
export const ReflectOnCal = async () => {
  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバー一覧を取得
  const members_cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(members_cells, 2).filter(v => !/^,+$/.test(v.toString()))

  // 凸状況一覧を取得
  const col = (await dateTable.TakeDate()).col
  const status_cells = await spreadsheet.GetCells(sheet, `${col}3:${AtoA(col, 3)}32`)
  const status: string[][] = PiecesEach(status_cells, 4).slice(0, members.length)

  // メンバー全体の状態を取得
  const state = await Fetch()

  const list = members.map((m, i) => {
    // メンバー一覧と一致するメンバーの状態を取得
    const member = state.find(s => s.id === m[1])
    if (!member) return

    // メンバーの状態を更新する
    const s = status[i]
    member.name = m[0]
    member.convex = s[0]
    member.over = s[1]
    member.end = s[2]
    member.history = s[3]

    return member
  })

  // mapだとsetTimeOutされないのでfor-ofで更新をする
  for (const m of list) {
    if (!m) return
    await UpdateMember(m)
    await util.Sleep(50)
  }
}
