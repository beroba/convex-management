import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../util'
import * as io from '.'
import {Plan} from './type'

/**
 * キャルステータスの凸予定の情報を更新する
 * @param plans 凸予定一覧
 */
export const Update = async (plans: Plan[]) => {
  // 8個ずつに分割
  PiecesEach(plans, 8).forEach(async (p, i) => {
    // キャルステータスを更新
    await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS[i], p)
  })
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
  if (!plan) return [plans, null]

  // 凸予定一覧から渡されたidの凸予定を取り除く
  plans = plans.filter(p => p.senderID !== id)

  // 1つ先の予定を消すようにする
  if (plans.length % 8 === 0) {
    await io.UpdateArray(Settings.CAL_STATUS_ID.PLANS[(plans.length / 8) | 0], [])
    await util.Sleep(50)
  }

  // キャルステータスを更新
  await Update(plans)

  return [plans, plan]
}

/**
 * 渡されたidの凸予定のメッセージを編集する
 * @param text 変更するテキスト
 * @param id 変更したいの凸予定のid
 * @return 編集した凸予定一覧
 */
export const Edit = async (text: string, id: string): Promise<Plan[]> => {
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

  // キャルステータスを更新
  await Update(plans)

  return plans
}

/**
 * キャルステータスから凸予定一覧を取得する
 * @return 凸予定一覧
 */
export const Fetch = async (): Promise<Plan[]> => {
  let plans: Plan[] = []

  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  for (const i of range) {
    // 凸予定を取得
    const p = await io.Fetch<Plan[]>(Settings.CAL_STATUS_ID.PLANS[i])

    // 凸予定を結合
    plans = plans.concat(p)

    // 8個以下なら終了
    if (p.length < 8) break
  }

  return plans
}

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
