/**
 * [a-e]の型
 */
export type Alpha = 'a' | 'b' | 'c' | 'd' | 'e'

/**
 * クラバトのボステーブル
 */
export type BossTable = {
  num: string
  alpha: string
  name: string
}

/**
 * クラバトの日付テーブル
 */
export type DateTable = {
  num: string
  day: string
  col: string
}

/**
 * 現在のボス状況
 * @type num: string
 * @type alpha: string
 * @type name: string
 * @type hp: number
 * @type subjugate: boolean
 */
export type CurrentBoss = BossTable & {
  hp: number
  subjugate: boolean
}

/**
 * 現在の状況
 */
export type Current = {
  stage: string
  lap: string
  a: CurrentBoss
  b: CurrentBoss
  c: CurrentBoss
  d: CurrentBoss
  e: CurrentBoss
}

/**
 * ユーザー情報
 */
export type User = {
  name: string
  id: string
  limit: string
  declare: string
}

/**
 * 凸管理状況
 */
export type Status = {
  convex: string
  over: string
  end: string
  history: string
}

/**
 * メンバーの状態
 * @type name: string
 * @type id: string
 * @type limit: string
 * @type declare: string
 * @type convex: string
 * @type over: string
 * @type end: string
 * @type history: string
 */
export type Member = User & Status

/**
 * 凸予定の情報
 */
export type Plan = {
  done: string
  senderID: string
  calID: string
  name: string
  playerID: string
  num: string
  alpha: string
  boss: string
  msg: string
}
