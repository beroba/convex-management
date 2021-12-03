import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as report from './report'
import * as boss from './boss'
import * as plan from './plan'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Member, Plan} from '../../util/type'

/**
 * 全体の凸状況を更新する
 * @param members メンバー一覧
 * @param state 現在の状況
 */
export const Report = async (members?: Member[], state?: Current) => {
  members ??= await status.Fetch()
  state ??= await current.Fetch()

  // 昇順ソート
  members = members.sort((a, b) => (a.name > b.name ? 1 : -1))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)

  // 全体状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.WHOLE)
    const text = await report.CreateWholeText(members, state)
    await msg.edit(text)
    await history.send(text)
  }
  // 残凸状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.CONVEX)
    const text = await report.CreateConvexText(members)
    await msg.edit(text)
    await history.send(text)
  }
  // 持越状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.OVER)
    const text = await report.CreateOverText(members)
    await msg.edit(text)
    await history.send(text)
  }

  console.log('Overall convex situation update')
}

/**
 * ボス状況を更新する
 * @param members メンバー一覧
 * @param state 現在の状況
 */
export const Boss = async (members?: Member[], state?: Current) => {
  members ??= await status.Fetch()
  state ??= await current.Fetch()

  // 昇順ソート
  members = members.sort((a, b) => (a.name > b.name ? 1 : -1))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  // const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)

  const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.BOSS)
  const text = await boss.CreateBossText(members, state)
  await msg.edit(text)

  console.log('Boss status update')
}

/**
 * 凸予定を更新する
 * @param plans 凸予定一覧
 */
export const Plans = async (plans?: Plan[]) => {
  plans ??= await schedule.Fetch()

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)

  const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.PLAN)
  const text = await plan.CreateAllPlanText(plans)
  await msg.edit(text)

  console.log('Convex schedule update of convex situation')
}

/**
 * 凸予定一覧を更新する
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 */
export const DeclarePlan = async (alpha: AtoE, state?: Current, channel?: Discord.TextChannel) => {
  state ??= await current.Fetch()
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].PLAN)
  const plans = await schedule.Fetch()
  const text = await plan.CreatePlanText(alpha, state.stage, plans)

  // 凸予定の前2行を取り除いて結合
  await msg.edit('凸予定\n```ts\n' + text.split('\n').slice(2).join('\n'))
}
