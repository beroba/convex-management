import * as Discord from 'discord.js'
import * as util from '../../util'

export const Command = (msg: Discord.Message) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel('COMMAND_CHANNEL', msg.channel)) return

  console.log(msg.guild?.roles.cache.get('719906267824521267')?.members.map(m => m.user.username))
}
