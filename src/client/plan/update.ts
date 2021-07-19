import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as bossTable from '../../io/bossTable'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {AtoE, Plan} from '../../io/type'

/**
 * 凸予定を更新する
 * @param msg DiscordからのMessage
 * @return 更新後の予定
 */
export const Plans = async (msg: Discord.Message): Promise<[Plan[], Plan]> => {
  // 凸予定のオブジェクトを作成
  const plan = await createPlan(msg)

  // 予定したボスを報告し、報告したキャルのメッセージIDを取得
  plan.calID = (await msg.reply(`${plan.boss}を予定したわよ！\nid: ${plan.senderID}`)).id

  // 凸予定シートの値を更新
  const plans = await schedule.Add(plan)

  // 完了の絵文字をつける
  await msg.react(Settings.EMOJI_ID.KANRYOU)

  // ボス番号のロールを付与
  await msg.member?.roles.add(Settings.BOSS_ROLE_ID[plan.alpha])

  return [plans, plan]
}

/**
 * 凸予定のオブジェクトを作成する
 * @param msg DiscordからのMessage
 * @return 作成した凸予定
 */
const createPlan = async (msg: Discord.Message): Promise<Plan> => {
  // 編集されたメッセージを整形
  const content = util.Format(msg.content.replace(/\n/g, ' '))

  // ボス番号とボス名を取得
  const alpha = NtoA(content[0]) as AtoE
  const boss = await bossTable.TakeName(alpha)

  // メンバーの状態を取得
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
