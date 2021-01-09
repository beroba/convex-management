import Settings from 'const-settings'
import Option from 'type-of-option'
import * as io from '.'
import {Members, User} from './type'

/**
 * メンバーの状態の名前とidを設定する
 * @param ユーザー情報
 */
export const UpdateUser = async (users: Option<User[]>) => {
  const members: Option<Members[]> = users?.map(u => ({
    name: u.name,
    id: u.id,
    convex: '',
    over: '',
    leave: '',
  }))

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS, members)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Members[]> => io.Fetch<Members[]>(Settings.CAL_STATUS_ID.MEMBERS)
