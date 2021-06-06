import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'
import * as io from '.'
import * as dateTable from './dateTable'
import {User, Status, Member} from './type'
import * as limitTime from '../client/convex/limitTime'

/**
 * キャルステータスのメンバーの状態を更新する
 * @param members メンバー一覧
 */
export const Update = async (members: Member[]) => {
  // 15個ずつに分割
  PiecesEach(members, 15).forEach(async (m, i) => {
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
    convex: '',
    over: '',
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
    convex: '',
    over: '',
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
  // 結合して返す
  return m1.concat(m2)
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
 * @param member 更新したいメンバー
 */
export const ReflectOnSheet = async (member: Member) => {
  // 情報のシートを取得
  const info = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 凸状況と活動限界時間を更新する
  reflectOnConvex(member, info)
  reflectOnLimit(member, info)
}

/**
 * メンバーの凸状況を反映させる
 * @param member 更新したいメンバー
 * @param info 情報のシート
 */
const reflectOnConvex = async (member: Member, info: any) => {
  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await FetchUserFromSheet(info)

  // 行と列を取得
  const col = (await dateTable.TakeDate()).col
  const row = users.map(u => u.id).indexOf(member.id) + 3

  // 凸数、持ち越し、3凸終了、履歴を更新する
  await Promise.all(
    [member.convex, member.over, member.end, member.history].map(async (v, i) => {
      const cell = await sheet.getCell(`${AtoA(col, i)}${row}`)
      await cell.setValue(v)
    })
  )
}

/**
 * メンバーの活動限界時間を反映させる
 * @param member 更新したいメンバー
 * @param info 情報のシート
 */
const reflectOnLimit = async (member: Member, info: any) => {
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
 * スプレッドシートの凸状況をキャルに反映させる
 */
export const ReflectOnCal = async () => {
  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await FetchUserFromSheet(sheet)

  // スプレッドシートから凸状況一覧を取得
  const status = await fetchStatusFromSheet(users, sheet)

  // usersとstatusをmergeしてmembersを作る
  const members: Member[] = status.map((s, i) => ({
    name: users[i].name,
    id: users[i].id,
    limit: users[i].limit.replace('時', ''),
    declare: users[i].declare,
    convex: s.convex,
    over: s.over,
    end: s.end,
    history: s.history,
  }))

  // キャルステータスを更新する
  await Update(members)

  // 活動限界時間の表示を更新
  limitTime.Display(members)
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

  // prettier-ignore
  await Promise.all(
    state.map(async (_, j) => {
      // 行を取得
      const row = j + 3
      // 凸数、持ち越し、3凸終了、履歴をリセットする
      await Promise.all(
        Array(4).fill('').map(async (v, i) => {
          const cell = await sheet.getCell(`${AtoA(col, i)}${row}`)
          await cell.setValue(v)
        })
      )
    })
  )
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
      }
    })
}

/**
 * 凸状況のシートからユーザーの分だけ凸状況を取得する
 * @param users ユーザー一覧
 * @param sheet 凸状況のシート
 * @return 凸状況一覧
 */
const fetchStatusFromSheet = async (users: User[], sheet: any): Promise<Status[]> => {
  // 今日の日付から列を取得
  const col = (await dateTable.TakeDate()).col

  const cells = await spreadsheet.GetCells(sheet, `${col}3:${AtoA(col, 3)}32`)
  return PiecesEach(cells, 4)
    .slice(0, users.length)
    .map(s => ({
      convex: s[0],
      over: s[1],
      end: s[2],
      history: s[3],
    }))
}
