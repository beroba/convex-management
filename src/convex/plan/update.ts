import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as bossTable from '../../io/bossTable'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Plan} from '../../util/type'

/**
 * 凸予定を更新する
 * @param msg DiscordからのMessage
 * @return 更新後の予定
 */
export const Plans = async (msg: Discord.Message): Promise<[Plan[], Plan]> => {
  const plan = await createPlan(msg)

  // prettier-ignore
  const text = [
    `${plan.boss}を予定したわよ！`,
    `id: ${plan.senderID}`,
  ].join('\n')
  const m = await msg.reply(text)

  plan.calID = m.id
  const plans = await schedule.Add(plan)

  await msg.react(Settings.EMOJI_ID.KANRYOU)
  await msg.member?.roles.add(Settings.BOSS_ROLE_ID[plan.alpha])

  return [plans, plan]
}

/**
 * 凸予定のオブジェクトを作成する
 * @param msg DiscordからのMessage
 * @return 作成した凸予定
 */
const createPlan = async (msg: Discord.Message): Promise<Plan> => {
  const content = util.Format(msg.content.replace(/\n/g, ' '))

  const alpha = NtoA(content[0]) as AtoE
  const boss = await bossTable.TakeName(alpha)

  const member = await status.FetchMember(msg.author.id)

  return {
    senderID: msg.id,
    calID: '',
    name: member?.name ?? '',
    playerID: msg.member?.id ?? '',
    num: content[0],
    alpha: alpha,
    boss: boss ?? '',
    msg: content.slice(1).trim(),
  }
}
