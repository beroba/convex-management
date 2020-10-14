import * as Discord from 'discord.js'
import * as util from '../../util'

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param arg プレイヤーidと凸状況
 * @param msg DiscordからのMessage
 */
export const Update = (arg: string, msg: Discord.Message) => {
  const [id, convex] = util.Format(arg).split(' ')
  console.log(id)
  console.log(convex)
  msg
}
