import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as date from '../convex/date'
import * as situation from '../convex/situation'
import * as status from './status'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // クランメンバーじゃなければ終了
  const isRole = msg.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) {
    msg.reply('今日はクラバトの日じゃないわ')
    return "It's not ClanBattle days"
  }

  // 凸状況を更新
  const over = await status.Update(msg)
  if (over === undefined) {
    msg.reply('もう3凸してるわ')
    return
  }

  // 凸状況に報告
  situation.Report()

  return 'Update status'
}
