import Option from 'type-of-option'
// import Settings from 'const-settings'
// import PiecesEach from 'pieces-each'
// import * as util from '../util'
import * as io from '.'
import {User, Member} from './type'

/**
 * メンバーの状態を更新する
 * @param members メンバー一覧
 */
export const Update = async (members: Member[]) => {
  await io.UpdateArray('members', members)
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
    end: false,
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
    end: false,
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
export const Fetch = async (): Promise<Member[]> => io.Fetch<Member[]>('members')

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
 * スプレッドシートの名前をbotへ適用する
 */
export const SetNamesFromSheet = async () => {
  /*
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // メンバー全体の状態を取得
  let members = await Fetch()

  // メンバーの名前だけスプレッドシートの値に変更
  const cells = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.MEMBER_CELLS)
  members = PiecesEach(cells, 3)
    .filter(util.Omit)
    .map(u => {
      const id = u[1]
      const member = <Member>members.find(m => m.id === id)
      return {
        name: u[0],
        id: member.id,
        limit: member.limit,
        declare: member.declare,
        carry: member.carry,
        convex: member.convex,
        over: member.over,
        end: member.end,
        history: member.history,
      }
    })

  // キャルステータスを更新
  await Update(members)
  // */
}
