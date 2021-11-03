import * as io from './redis'
import {AtoE, Damage, DamageList} from '../util/type'

/**
 * ダメージリストを更新
 * @param list ダメージリスト
 */
export const Update = async (list: DamageList) => {
  await io.UpdateArray('damageList', list)
}

/**
 * 特定ボスのダメージ一覧を更新
 * @param alpha ボス番号
 * @param damage ダメージ一覧
 * @return ダメージリスト
 */
export const UpdateBoss = async (alpha: AtoE, damage: Damage[]): Promise<DamageList> => {
  const list = await Fetch()
  list[alpha] = damage
  await io.UpdateArray('damageList', list)
  return list
}

/**
 * キャルステータスからダメージリストを取得
 * @return ダメージリスト
 */
export const Fetch = async (): Promise<DamageList> => {
  return io.Fetch<DamageList>('damageList')
}

/**
 * キャルステータスから特定ボスのダメージ一覧を取得
 * @return ダメージリスト
 */
export const FetchBoss = async (alpha: AtoE): Promise<Damage[]> => {
  const list = await Fetch()
  return list[alpha]
}
