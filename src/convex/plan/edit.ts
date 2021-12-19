import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as situation from '../situation'
import * as declare from '../declare/list'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
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

  const member = await status.FetchMember(msg.author.id)
  if (!member) return

  const content = util.Format(msg.content.replace(/\n/g, ' '))
  const alpha = NtoA(content[0]) as AtoE
  const text = content.slice(1).trim()
  const plans = await schedule.Edit(text, member.id.first())

  situation.Plans(plans)
  situation.DeclarePlan(alpha)
  declare.SetUser(alpha)

  return 'Edit appointment message'
}

/**
 * 渡されたIDの凸予定を入れ替える
 * @param alpha ボス番号
 * @param id ユーザーID
 * @return 更新処理の実行結果
 */
export const Swap = async (alpha: AtoE, id: string): Promise<string> => {
  let plans = await schedule.Fetch()
  const pList = plans.filter(p => p.alpha === alpha).filter(p => p.playerID === id)
  // 入れ替える凸予定が無い場合は終了
  if (pList.length < 2) return ''
  const plan = pList.first()
  plans = await schedule.Swap(plan.msgID)

  situation.Plans(plans)
  situation.DeclarePlan(alpha)
  declare.SetUser(alpha)

  return 'Swap reservation messages'
}
