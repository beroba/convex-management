/**
 * [a-e]の型
 */
export type AtoE = 'a' | 'b' | 'c' | 'd' | 'e'

/**
 * クラバトのボステーブル
 * @property num ボス番号 (数字)
 * @property alpha ボス番号 (英語)
 * @property boss ボスの名前
 */
export type BossTable = {
  num: string
  alpha: AtoE
  name: string
}

/**
 * クラバトの日付テーブル
 * @property num クラバトの日数
 * @property day クラバトの日付
 * @property col カラム
 */
export type DateTable = {
  num: string
  day: string
  col: string
}

/**
 * 現在のボス状況
 * @property hp ボスのHP
 * @property subjugate ボスが討伐されたかの管理
 */
export type CurrentBoss = BossTable & {
  lap: number
  hp: number
}

/**
 * 現在の状況
 * @property stage 現在の段階
 * @property lap 現在の周回数
 * @property a 1ボスの状況
 * @property b 2ボスの状況
 * @property c 3ボスの状況
 * @property d 4ボスの状況
 * @property e 5ボスの状況
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
 * @property senderID 送信者のID
 * @property calID botのID
 * @property name ボスの名前
 * @property playerID ユーザーのID
 * @property num ボス番号 (数字)
 * @property alpha ボス番号 (英語)
 * @property boss ボスの名前
 * @property msg 予定の内容
 */
export type Plan = {
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
 * @property name ユーザーの名前
 * @property id ユーザーのID
 * @property limit 活動限界時間
 * @property declare 凸宣言先の情報
 * @property carry 持越凸かの管理
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
 * @property convex 残凸の数
 * @property over 持越の数
 * @property end 凸が終了しているかの管理
 * @property history 凸の履歴
 */
export type Status = {
  convex: number
  over: number
  end: boolean
  history: string
}

/**
 * メンバーの状態
 * @type name: string ユーザーの名前
 * @type id: string ユーザーのID
 * @type limit: string 活動限界時間
 * @type declare: string 凸宣言先の情報
 * @type carry: boolean 持越凸かの管理
 * @type convex: number 残凸の数
 * @type over: number 持越の数
 * @type end: boolean 凸が終了しているかの管理
 * @type history: string 凸の履歴
 */
export type Member = User & Status
