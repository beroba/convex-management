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
 * @param member メンバー情報
 * @return メンバー一覧
 */
export const UpdateMember = async (member: Member): Promise<Member[]> => {
  let members = await Fetch()

  members = members.map(m => (m.id.find(N => member.id.find(n => n === N)) ? member : m))
  await Update(members)

  return members
}

/**
 * メンバー全員の状態の名前とidを設定する
 * @param users ユーザー情報
 */
export const UpdateUsers = async (users: Option<User[]>): Promise<Member[]> => {
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
  if (!members) return []

  await Update(members)

  return members
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
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

  await Update(members)
}

/**
 * メンバー全員の凸宣言をリセットする
 */
export const ResetDeclare = async () => {
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

  await Update(members)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Member[]> => {
  return io.Fetch<Member[]>('members')
}

/**
 * キャルステータスからメンバーの状態を取得
 * @param id メンバーのID
 * @return メンバーの状態
 */
export const FetchMember = async (id: string): Promise<Option<Member>> => {
  const members = await Fetch()

  // メンバーが存在しない場合はundefinedを返す
  const member = members.filter(s => s.id.find(n => n === id))
  return member.length === 0 ? undefined : member.first()
}

/**
 * botが認識している名前を変更する
 * @param member メンバーの状態
 * @param name 変更先の名前
 * @return 更新後のメンバー一覧
 */
export const SetName = async (member: Member, name: string): Promise<Member[]> => {
  member.name = name
  return UpdateMember(member)
}

/**
 * サブアカウントを設定する
 * @param member メンバーの状態
 * @param subID サブアカウントのID
 */
export const SetSubAccount = async (member: Member, subID: string): Promise<Member[]> => {
  member.id = [...member.id, subID]
  return UpdateMember(member)
}

/**
 * IDをリセットする
 * @param member メンバーの状態
 * @param id リセット先のid
 */
export const ResetAccountID = async (member: Member, id: string): Promise<Member[]> => {
  member.id = [id]
  return UpdateMember(member)
}

/**
 * スプレッドシートの名前をbotへ適用する
 * @return 値がなかった場合のエラー
 */
export const SetNames = async (): Promise<Option<Error>> => {
  const list = await json.Fetch('user')
  if (!list) return Error()

  let members = await Fetch()

  // ユーザー名だけjsonの値を適用
  members = members.map(m => {
    const name = m.id
      .map(id => list[id])
      .filter(Boolean)
      .first()
    return {
      name: name,
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

  await Update(members)
}
