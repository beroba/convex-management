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
 * 現在の状況
 */
export type Current = {
  stage: string
  lap: string
  boss: string
  num: string
  alpha: string
  hp: string
}

/**
 * ユーザー情報
 */
export type User = {
  name: string
  id: string
  limit: string
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
