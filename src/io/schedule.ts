import Option from 'type-of-option'
import * as io from './redis'
import {Plan} from '../util/type'

/**
 * キャルステータスの凸予定の情報を更新する
 * @param plans 凸予定一覧
 */
export const Update = async (plans: Plan[]) => {
  await io.UpdateArray('plan', plans)
}

/**
 * 凸予定を追加する
 * @param plan 追加する予定
 * @return 追加後の予定
 */
export const Add = async (plan: Plan): Promise<Plan[]> => {
  const plans = await Fetch()

  plans.push(plan)
  await Update(plans)

  return plans
}

/**
 * 渡されたidの凸予定を削除する
 * @param id 削除したい凸予定のid
 * @return 凸予定一覧と削除した凸予定
 */
export const Delete = async (id: string): Promise<[Plan[], Option<Plan>]> => {
  let plans = await Fetch()

  const plan = plans.find(p => p.msgID === id)
  if (!plan) return [plans, plan]

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.filter(p => p.msgID !== id)
  await Update(plans)

  return [plans, plan]
}

/**
 * 全ての凸予定を削除する
 */
export const AllDelete = async () => {
  await io.UpdateArray('plan', [])
}

/**
 * 渡されたidの凸予定のメッセージを編集する
 * @param text 変更するテキスト
 * @param id 変更したい凸予定のid
 * @return 編集した凸予定一覧
 */
export const Edit = async (text: string, id: string): Promise<Plan[]> => {
  let plans = await Fetch()

  plans = plans.map(p => {
    // 一致する凸予定以外はそのまま帰す
    if (p.msgID !== id) return p

    p.msg = text
    return p
  })

  await Update(plans)

  return plans
}

/**
 * 渡されたidの凸予定を最後尾に移動する
 * @param id 移動したい凸予定のid
 * @return 編集した凸予定一覧
 */
export const Swap = async (id: string): Promise<Plan[]> => {
  let plans = await Fetch()

  const plan = plans.find(p => p.msgID === id)
  if (!plan) return plans

  plans = [...(plans.filter(p => p.msgID !== id) as Plan[]), plan]
  await Update(plans)

  return plans
}

/**
 * キャルステータスから凸予定一覧を取得する
 * @return 凸予定一覧
 */
export const Fetch = async (): Promise<Plan[]> => {
  return io.Fetch<Plan[]>('plan')
}

/**
 * 渡されたボス番号の凸予定一覧を取得する
 * @param alpha ボス番号
 * @return 凸予定一覧
 */
export const FetchBoss = async (alpha: string): Promise<Plan[]> => {
  const plans = await Fetch()

  // 特定のボス番号の値だけにする
  return plans.filter(p => p.alpha === alpha)
}
