import Option from 'type-of-option'
import * as io from './redis'
import {Plan} from './type'

/**
 * キャルステータスの凸予定の情報を更新する
 * @param plans 凸予定一覧
 */
export const Update = async (plans: Plan[]) => {
  await io.UpdateArray('plan', plans)
}

/**
 * 凸予定を追加する
 * @param 追加する予定
 * @return 追加後の予定
 */
export const Add = async (plan: Plan): Promise<Plan[]> => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 凸予定を追加
  plans.push(plan)

  // キャルステータスを更新
  await Update(plans)

  return plans
}

/**
 * 渡されたidの凸予定を削除する
 * @param id 削除したい凸予定のid
 * @return 凸予定一覧と削除した凸予定
 */
export const Delete = async (id: string): Promise<[Plan[], Option<Plan>]> => {
  // 凸予定一覧を取得
  let plans = await Fetch()

  // 一致する凸予定がない場合は終了
  const plan = plans.find(p => p.senderID === id)
  if (!plan) return [plans, plan]

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.filter(p => p.senderID !== id)

  // キャルステータスを更新
  await Update(plans)

  return [plans, plan]
}

/**
 * 全ての凸予定を削除する
 * @param id 削除したい凸予定のid
 */
export const AllDelete = async () => {
  await io.UpdateArray('plan', [])
}

/**
 * 渡されたidの凸予定のメッセージを編集する
 * @param text 変更するテキスト
 * @param id 変更したいの凸予定のid
 * @return 編集した凸予定一覧
 */
export const Edit = async (text: string, id: string): Promise<Plan[]> => {
  // 凸予定一覧を取得
  let plans = await Fetch()

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.map(p => {
    // 一致する凸予定以外はそのまま帰す
    if (p.senderID !== id) return p

    // メッセージを変更して返す
    p.msg = text
    return p
  })

  // キャルステータスを更新
  await Update(plans)

  return plans
}

/**
 * キャルステータスから凸予定一覧を取得する
 * @return 凸予定一覧
 */
export const Fetch = async (): Promise<Plan[]> => io.Fetch<Plan[]>('plan')

/**
 * 渡されたボス番号の凸予定一覧を取得する
 * @param alpha ボス番号
 * @return 凸予定一覧
 */
export const FetchBoss = async (alpha: string): Promise<Plan[]> => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 特定のボス番号の値だけ返す
  return plans.filter(p => p.alpha === alpha)
}
