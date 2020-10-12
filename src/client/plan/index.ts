import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as date from '../convex/date'
import * as list from './list'
import * as status from './status'

/**
 * 凸予定を行う
 * @param msg DiscordからのMessage
 * @return 凸予定の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // クランメンバーじゃなければ終了
  const isRole = msg.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) {
    const cal = await msg.reply('クランメンバーじゃないわ\n※15秒にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 15000)
    return 'Not a clan member'
  }

  // ボス番号が書式通りか確認する
  if (!formatConfirm(msg)) {
    const cal = await msg.reply('書式が違うから予定できないわ\n※15秒にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 15000)
    return 'The format of the boss number is different'
  }

  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) {
    const cal = await msg.reply('今日はクラバトの日じゃないわ\n※15秒にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 15000)
    return "It's not ClanBattle days"
  }

  // 凸予定を更新
  await status.Update(msg)

  // 凸状況を更新
  list.SituationEdit()

  return 'Make a convex reservation'
}

/**
 * ボス番号の書式が合っているか確認する
 * @param msg DiscordからのMessage
 * @return 真偽値
 */
const formatConfirm = (msg: Discord.Message): boolean => {
  // prettier-ignore
  const num = util.Format(msg.content).split(' ')[0]
  return /[1-5]/.test(num)
}
