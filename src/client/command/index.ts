import * as Discord from 'discord.js'
import Option from 'type-of-option'
import {Management} from './management'
import {ClanBattle} from './clanbattle'

/**
 * `/`から始まるコマンドの処理をする
 * @param msg DiscordからのMessage
 */
export const Command = (msg: Discord.Message) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  let comment: Option<string>

  // クラバト用コマンドを実行
  comment = ClanBattle(msg.content, msg)
  if (comment) return console.log(comment)

  // 運営管理用コマンドを実行
  comment = Management(msg.content, msg)
  if (comment) return console.log(comment)
}
