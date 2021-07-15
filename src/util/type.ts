/**
 * TL修正用の前後
 * @property before 変更前のTL
 * @property after 変更後のTL
 */
export type TLFormat = {
  before: string
  after: string
}

/**
 * キューに入れて実行する関数と引数
 * @property func 実行する関数
 * @property args 関数に渡す引数
 */
export type Process = {
  func: any
  args: any[]
}

/**
 * キューの状態
 * @property stream 処理が実行中かの管理
 * @property process 処理を保存する箇所
 */
export type Queue = {
  stream: boolean
  process: Process[]
}
