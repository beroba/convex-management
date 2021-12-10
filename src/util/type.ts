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
 */
export type DateTable = {
  num: string
  day: string
}

/**
 * 現在のボス状況
 * @property lap ボスの周回数
 * @property hp ボスのHP
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
 * @property msgID メッセージのID
 * @property calID botのID
 * @property playerID ユーザーのID
 * @property name ボスの名前
 * @property num ボス番号 (数字)
 * @property alpha ボス番号 (英語)
 * @property boss ボスの名前
 * @property msg 予定の内容
 */
export type Plan = {
  msgID: string
  calID: string
  playerID: string
  name: string
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
 * @property carry 持越凸の管理
 */
export type User = {
  name: string
  id: string[]
  limit: string
  declare: string
  carry: boolean
}

/**
 * 凸管理状況
 * @property convex 残凸の数
 * @property over 持越の数
 * @property end 3凸終了の管理
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
 * @type carry: boolean 持越凸の管理
 * @type convex: number 残凸の数
 * @type over: number 持越の数
 * @type end: boolean 3凸終了の管理
 * @type history: string 凸の履歴
 */
export type Member = User & Status

/**
 * [ok|ng|check|none]の型
 */
export type DamageFlag = 'ok' | 'ng' | 'check' | 'none'

/**
 * ダメージ報告の内容
 * @property name ユーザーの名前
 * @property id ユーザーのID
 * @property num 凸報告の順番
 * @property exclusion ダメージ計算から除外するかの真偽値
 * @property flag ダメージのフラグ
 * @property text ダメージ報告のテキスト
 * @property damage ダメージの値
 * @property time 残り秒数の値
 * @property already 報告済みかの真偽値
 */
export type Damage = {
  name: string
  id: string
  num: string
  exclusion: boolean
  flag: DamageFlag
  text: string
  damage: number
  time: number
  date: string
  already: boolean
}

/**
 * ダメージ報告のリスト
 * @property a 1ボスのダメージ報告
 * @property b 2ボスのダメージ報告
 * @property c 3ボスのダメージ報告
 * @property d 4ボスのダメージ報告
 * @property e 5ボスのダメージ報告
 */
export type DamageList = {
  a: Damage[]
  b: Damage[]
  c: Damage[]
  d: Damage[]
  e: Damage[]
}

/**
 * キャルステータスのjson形式
 */
export type Json = {[key: string]: string}

/**
 * TL保存用のリスト
 * @property index リストの場所
 * @property list リスト本体
 */
export type TLList = {
  index: number
  list: string[]
}

/**
 * TL修正で使う変更用文字列の前後
 * @property before 変更前の文字列
 * @property after 変更後の文字列
 */
export type TLFormat = {
  before: string
  after: string
}
