import * as Discord from 'discord.js'
import Settings from 'const-settings'

export const Report = (msg: Discord.Message) => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 凸報告チャンネルでなければ終了
  if (msg.channel.id !== Settings.CONVEX_CHANNEL.REPORT_ID) return

  switch (true) {
    case /1|2|3/.test(msg.content.charAt(0)):
      msg.react(Settings.EMOJI_ID.KAKUNIN)
      break
    default:
      msg.reply('形式が違うわ、やりなおし！')
  }
}
