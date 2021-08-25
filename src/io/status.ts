import Option from 'type-of-option'
import * as io from './redis'
import * as json from './json'
import {User, Member} from '../util/type'

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
 * botが認識している名前を変更する
 * @param member メンバーの状態
 * @param name 変更先の名前
 */
export const SetName = async (member: Member, name: string) => {
  // 名前を更新
  member.name = name

  // ステータスを更新
  await UpdateMember(member)
}

/**
 * スプレッドシートの名前をbotへ適用する
 * @return 値がなかった場合のエラー
 */
export const SetNames = async (): Promise<Option<Error>> => {
  // ユーザー情報のjsonを取得
  const list = await json.Fetch('user')
  if (!list) return Error()

  // メンバー全体の状態を取得
  let members = await Fetch()

  // ユーザー名だけjsonの値を適用
  members = members.map(m => {
    return {
      name: list[m.id],
      id: m.id,
      limit: m.limit,
      declare: m.declare,
      carry: m.carry,
      convex: m.convex,
      over: m.over,
      end: m.end,
      history: m.history,
    }
  })

  // キャルステータスを更新
  await Update(members)
}
