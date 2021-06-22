/**
 * [a-e]の型
 */
export type AtoE = 'a' | 'b' | 'c' | 'd' | 'e'

/**
 * クラバトのボステーブル
 */
export type BossTable = {
  num: string
  alpha: AtoE
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
 * @type alpha: AtoE
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
  lap: number
  a: CurrentBoss
  b: CurrentBoss
  c: CurrentBoss
  d: CurrentBoss
  e: CurrentBoss
}

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
  alpha: AtoE
  boss: string
  msg: string
}

/**
 * ユーザー情報
 */
export type User = {
  name: string
  id: string
  limit: string
  declare: string
  carry: boolean
}

/**
 * 凸管理状況
 */
export type Status = {
  convex: number
  over: number
  end: string
  history: string
}

/**
 * メンバーの状態
 * @type name: string
 * @type id: string
 * @type limit: string
 * @type declare: string
 * @type carry: boolean
 * @type convex: number
 * @type over: number
 * @type end: string
 * @type history: string
 */
export type Member = User & Status

/**
 * TL修正用の前後
 */
export type TLFormat = {
  before: string
  after: string
}
