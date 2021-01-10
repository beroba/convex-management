import Settings from 'const-settings'
import Option from 'type-of-option'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as dateTable from './dateTable'
import {Member, User} from './type'

/**
 * メンバー個々の状態を設定する
 * @param メンバー情報
 */
export const UpdateMember = async (member: Member) => {
  const states = await Fetch()
  const members = states.map(s => (s.id === member.id ? member : s))

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
  const states = await Fetch()
  const members: Member[] = states.map(s => ({
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
  const states = await Fetch()
  const member = states.filter(s => s.id === id)
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
