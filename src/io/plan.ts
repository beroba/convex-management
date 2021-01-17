import Settings from 'const-settings'
import * as io from '.'
import {Plan} from './type'

/**
 * メンバー個々の状態を設定する
 * @param メンバー情報
 */
export const UpdateMember = async (plan: Plan) => {
  const plans = await Fetch()
  plans.push(plan)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.MEMBERS, plans)
}

/**
 * キャルステータスからメンバーの状態を取得
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Plan[]> => io.Fetch<Plan[]>(Settings.CAL_STATUS_ID.PLANS)
