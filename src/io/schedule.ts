import Settings from 'const-settings'
import * as io from '.'
import {Plan} from './type'
import Option from 'type-of-option'

/**
 * 凸予定を追加する
 * @param 追加する予定
 */
export const Add = async (plan: Plan) => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 凸予定を追加
  plans.push(plan)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)
}

/**
 * 渡されたidの凸予定を削除する
 * @param id 削除したい凸予定のid
 * @return 削除したPlanの値
 */
export const Delete = async (id: string): Promise<Option<Plan>> => {
  // 凸予定一覧を取得
  let plans = await Fetch()

  // 一致する凸予定がない場合は終了
  const plan = plans.find(p => p.senderID === id)
  if (!plan) return

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.filter(p => p.senderID !== id)

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)

  return plan
}

/**
 * 渡されたidの凸予定のメッセージを編集する
 * @param text 変更するテキスト
 * @param id 変更したいの凸予定のid
 */
export const Edit = async (text: string, id: string) => {
  // 凸予定一覧を取得s
  let plans = await Fetch()

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.map(p => {
    // 一致する凸予定以外はそのまま帰す
    if (p.senderID !== id) return p

    // メッセージを変更して返す
    p.msg = text
    return p
  })

  // キャルステータスを更新する
  await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS, plans)
}

/**
 * キャルステータスからメンバーの状態を取得する
 * @return メンバーの状態
 */
export const Fetch = async (): Promise<Plan[]> => io.Fetch<Plan[]>(Settings.CAL_STATUS_ID.PLANS)

/**
 * 渡されたボス番号の凸予定一覧を取得する
 * @param alpha ボス番号
 */
export const FetchBoss = async (alpha: string): Promise<Plan[]> => {
  // 凸予定一覧を取得
  const plans = await Fetch()

  // 特定のボス番号の値だけ返す
  return plans.filter(p => p.alpha === alpha)
}
