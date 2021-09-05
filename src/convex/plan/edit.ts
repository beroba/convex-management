import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as declare from '../declare/list'
import * as list from './list'
import * as schedule from '../../io/schedule'
import * as util from '../../util'
import {AtoE} from '../../util/type'

/**
 * 凸予定のメッセージを更新する
 * @param msg DiscordからのMessage
 * @return 更新処理の実行結果
 */
export const Message = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_RESERVATE
  if (!isChannel) return

  const content = util.Format(msg.content.replace(/\n/g, ' '))
  const alpha = NtoA(content[0]) as AtoE
  const text = content.slice(1).trim()
  const plans = await schedule.Edit(text, msg.id)

  await list.SituationEdit(plans)
  await declare.SetPlan(alpha)
  declare.SetUser(alpha)

  return 'Edit appointment message'
}
