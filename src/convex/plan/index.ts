import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as update from './update'
import * as situation from '../situation'
import * as declare from '../declare/list'
import * as status from '../../io/status'
import * as util from '../../util'

/**
 * 凸予定を行う
 * @param msg DiscordからのMessage
 * @return 凸予定の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_RESERVATE
  if (!isChannel) return

  const member = await status.FetchMember(msg.author.id)
  if (!member) {
    const cal = await msg.reply('クランメンバーじゃないわ\n※10秒後にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 10000)
    return 'Not a clan member'
  }

  // ボス番号が書式通りか確認する
  if (!formatConfirm(msg)) {
    const cal = await msg.reply('書式が違うから予定できないわ\n※10秒後にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 10000)
    return 'The format of the boss number is different'
  }

  // 予想ダメージを書いて居ない場合は終了
  if (msg.content.length === 1) {
    const cal = await msg.reply('予想ダメージが書いてないと動かないわ\n※10秒後にこのメッセージは消えます')
    setTimeout(() => (msg.delete(), cal.delete()), 10000)
    return "I didn't write the expected damage"
  }

  const [plans, plan] = await update.Plans(msg)

  situation.Plans(plans)
  declare.SetPlan(plan.alpha)
  declare.SetUser(plan.alpha)

  return 'Make a convex reservation'
}

/**
 * ボス番号の書式が合っているか確認する
 * @param msg DiscordからのMessage
 * @return 真偽値
 */
const formatConfirm = (msg: Discord.Message): boolean => {
  const num = util.Format(msg.content).split(' ').first()
  return /[1-5]/.test(num)
}
