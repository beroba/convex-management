import * as Discord from 'discord.js'
import Option from 'type-of-option'
import * as util from '../../util'
import {Management} from './management'
import {ClanBattle} from './clanbattle'

/**
 * `/`から始まるコマンドの処理をする
 * @param msg DiscordからのMessage
 */
export const Command = async (msg: Discord.Message) => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  const content = util.Format(msg.content)

  let comment: Option<string>

  // クラバト用コマンドを実行
  comment = await ClanBattle(content, msg)
  if (comment) return console.log(comment)

  // 運営管理用コマンドを実行
  comment = await Management(content, msg)
  if (comment) return console.log(comment)
}
