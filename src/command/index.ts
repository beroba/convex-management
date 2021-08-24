import * as Discord from 'discord.js'
import Option from 'type-of-option'
import * as util from '../util'
import {ClanBattle} from './clanbattle'
import {Management} from './management'

/**
 * `/`から始まるコマンドの処理をする
 * @param msg DiscordからのMessage
 */
export const Command = async (msg: Discord.Message) => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // 全角を全て半角にする
  const content = util.Format(msg.content)

  let comment: Option<string>

  // クラバト用コマンドを実行
  comment = await ClanBattle(content, msg)
  if (comment) return console.log(comment)

  // 運営管理用コマンドを実行
  comment = await Management(content, msg)
  if (comment) return console.log(comment)
}

/**
 * コマンドの引数だけ抽出する
 * @param command 引数以外のコマンド部分
 * @param content 入力された内容
 * @returns 取り除いた文字
 */
export const ExtractArgument = (command: string, content: string): Option<string> => {
  const c = content
    .split('\n') // 改行で分割
    .first() // 先頭の行だけ取り出す
    .trim() // 前後の空白を削除
    .replace(new RegExp(command, 'i'), '') // コマンド部分を削除
    .trim() // 前後の空白を削除
  return c || null // 引数がない場合はnull
}
