import Option from 'type-of-option'
import {Process, Queue} from '../util/type'

/**
 * キューの作成
 */
const queue: Queue = {
  stream: false,
  process: [],
}

/**
 * キューに実行する関数と引数を渡す
 * @param func 実行する関数
 * @param args 関数に渡す引数
 */
export const Add = async (func: any, ...args: any) => {
  // キューに追加
  queue.process.push({func, args})

  // 既に実行中なら終了
  if (queue.stream) return

  // 実行中の処理がない場合、先頭の処理を実行
  await exec(queue.process.shift())
}

/**
 * 渡された関数と引数を実行する
 * @param process 実行する関数と引数
 */
const exec = async (process: Option<Process>) => {
  // 実行する処理がなければ終了
  if (!process) return

  // 処理を実行中にする
  queue.stream = true

  // 処理を実行
  await process.func(...process.args)

  // キューに処理が残っているか確認
  if (queue.process.length > 0) {
    // 残っている場合、先頭の処理を実行
    await exec(queue.process.shift())
  } else {
    // 残っていない場合、実行中を解除して終了
    queue.stream = false
  }
}
