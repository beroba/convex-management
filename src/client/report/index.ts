import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as carryover from '../convex/carryover'
import * as situation from '../convex/situation'
import * as status from './status'
import * as cancel from '../plan/cancel'

/**
 * 凸状況の状態
 */
export type Status = {
  already: boolean
  over: boolean
  end: boolean
}

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

  // 凸状況を更新
  const result = await status.Update(msg)

  // 3凸していた場合は終了
  if (result.already) {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 持ち越しがある場合、持ち越し状況を削除
  if (result.over) carryover.AllDelete(msg)

  // 凸予定の削除
  if (result.end) {
    cancel.AllComplete(msg.author.id)
  } else {
    cancel.Report(msg)
  }

  // 凸状況に報告
  situation.Report()

  return 'Update status'
}
