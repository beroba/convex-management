const async = require('async')
import {Process} from '../util/type'

/**
 * キューの作成
 */
const queue = async.queue(async function (process: Process, callback: any) {
  await process.func(...process.args)
  callback()
}, 1)

/**
 * キューに実行する関数と引数を渡す
 * @param func 実行する関数
 * @param args 関数に渡す引数
 */
export const Push = async (func: any, ...args: any) => {
  const process: Process = {func, args}
  queue.push(process)
}
