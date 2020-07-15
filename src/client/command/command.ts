import * as Discord from 'discord.js'
import Settings from 'const-settings'

export const Command = (msg: Discord.Message) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 指定のチャンネル以外でキャルが動かないようにする
  const channel = msg.channel as Discord.TextChannel
  if (!Settings.COMMAND_CHANNEL.some((c: string) => c === channel?.name)) return
}
