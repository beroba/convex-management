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
