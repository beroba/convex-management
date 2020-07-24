import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const ConvexReport = async (msg: Discord.Message): Promise<Option<string>> => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 凸報告チャンネルでなければ終了
  if (msg.channel.id !== Settings.CONVEX_CHANNEL.REPORT_ID) return

  switch (true) {
    case /1|2|3/.test(msg.content.charAt(0)):
      updateStatus(msg)
      return 'Update status'
    default:
      msg.reply('形式が違うわ、やりなおし！')
      return 'Different format'
  }
}

/**
 * 凸状況の更新を行う
 * @param msg DiscordからのMessage
 */
const updateStatus = (msg: Discord.Message) => {
  // 確認と❌のスタンプ
  msg.react(Settings.EMOJI_ID.KAKUNIN)
  msg.react('❌')

  // ❌スタンプを押した際にデータの取り消しを行う
  msg.awaitReactions((react, user) => {
    if (user.id !== msg.author.id || react.emoji.name !== '❌') return false
    msg.reply('取り消したわ')
    console.log('Convex cancel')
    return true
  })

  // 3凸終了者にコメント
  if (msg.content === '3') {
    msg.reply('n人目の3凸終了者よ！')
  }
}
