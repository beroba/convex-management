import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as date from '../convex/date'
import * as status from './status'

/**
 * 凸予約を行う
 * @param msg DiscordからのMessage
 * @return 凸予約の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  // #予約でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // ボス番号が書式通りか確認する
  if (!formatConfirm(msg)) {
    msg.reply('書式が違うから予約できないわ')
    return 'The format of the boss number is different'
  }

  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) {
    msg.reply('今日はクラバトの日じゃないわ')
    return "It's not ClanBattle days"
  }

  // 凸予約を更新
  status.Update(msg)

  return 'Make a convex reservation'
}

/**
 * ボス番号の書式が合っているか確認する
 * @param msg DiscordからのMessage
 * @return 真偽値
 */
const formatConfirm = (msg: Discord.Message): boolean => {
  const arr = msg.content.replace(/　/g, ' ').split(' ')
  return /[1-5]|[１-５]/.test(arr[0])
}
