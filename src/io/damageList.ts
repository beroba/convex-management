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
 * @return ダメージ一覧
 */
export const UpdateBoss = async (alpha: AtoE, damage: Damage[]): Promise<Damage[]> => {
  const list = await Fetch()
  list[alpha] = numbering(damage)
  await io.UpdateArray('damageList', list)
  return list[alpha]
}

/**
 * ダメージ順にソートして番号を採番する
 * @param damages ダメージ一覧
 * @return ダメージ一覧
 */
const numbering = (damages: Damage[]): Damage[] => {
  const nums = '123456789abcdefghijklmnopqrstuvwxyz'.split('')

  const before = damages.filter(d => !d.already).sort((a, b) => b.damage - a.damage)
  const after = damages.filter(d => d.already).sort((a, b) => b.damage - a.damage)

  return [...before, ...after].map((d, i) => ({
    name: d.name,
    id: d.id,
    num: nums[i],
    exclusion: d.exclusion,
    flag: d.flag,
    text: d.text,
    damage: d.damage,
    time: d.time,
    already: d.already,
  }))
}

/**
 * ダメージリストを削除
 * @return ダメージリスト
 */
export const Delete = async (): Promise<DamageList> => {
  const list = {a: [], b: [], c: [], d: [], e: []}
  await io.UpdateArray('damageList', list)
  return list
}

/**
 * 特定ボスのダメージ一覧を削除
 * @param alpha ボス番号
 * @return ダメージ一覧
 */
export const DeleteBoss = async (alpha: AtoE): Promise<Damage[]> => {
  const list = await Fetch()
  list[alpha] = []
  await io.UpdateArray('damageList', list)
  return list[alpha]
}

/**
 * 特定ボスのダメージ一覧から渡されたIDのダメージを削除
 * @param alpha ボス番号
 * @param id ユーザーID
 * @return ダメージ一覧
 */
export const DeleteUser = async (alpha: AtoE, id: string): Promise<Damage[]> => {
  const list = await Fetch()
  list[alpha] = numbering(list[alpha].filter(d => d.id !== id))
  await io.UpdateArray('damageList', list)
  return list[alpha]
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
 * @return ダメージ一覧
 */
export const FetchBoss = async (alpha: AtoE): Promise<Damage[]> => {
  const list = await Fetch()
  return list[alpha]
}
