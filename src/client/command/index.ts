import * as Discord from 'discord.js'
import Option from 'type-of-option'
import {Management} from './management'
import {ClanBattle} from './clanbattle'
const moji = require('moji')

/**
 * `/`から始まるコマンドの処理をする
 * @param msg DiscordからのMessage
 */
export const Command = (msg: Discord.Message) => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  const content = moji(msg.content).convert('ZE', 'HE').convert('ZS', 'HS').toString()

  let comment: Option<string>

  // クラバト用コマンドを実行
  comment = ClanBattle(content, msg)
  if (comment) return console.log(comment)

  // 運営管理用コマンドを実行
  comment = Management(content, msg)
  if (comment) return console.log(comment)
}
