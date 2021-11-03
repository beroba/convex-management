import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as plan from '../plan/list'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Member, Plan} from '../../util/type'

/**
 * 凸宣言にリアクションしているユーザーから凸宣言一覧を作る
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 * @param members メンバー全体の状態
 */
export const SetUser = async (alpha: AtoE, channel?: Discord.TextChannel, members?: Member[]) => {
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  members ??= await status.Fetch()

  // 昇順ソート
  members = members.sort((a, b) => (a.name > b.name ? 1 : -1))

  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)
  const plans = await schedule.FetchBoss(alpha)

  const totu = await createDeclareList(members, plans, alpha, false)
  const mochikoshi = await createDeclareList(members, plans, alpha, true)

  const text = [
    '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
    '```',
    `- 凸宣言 ${totu.length}人`,
    `${totu.join('\n')}${totu.length ? '\n' : ''}`,
    `- 持越凸 ${mochikoshi.length}人`,
    `${mochikoshi.join('\n')}`,
    '```',
  ].join('\n')
  await msg.edit(text)
}

/**
 * 凸宣言一覧のリストを作成する
 * @param members メンバー全体の状態
 * @param plans 凸予定一覧
 * @param alpha ボス番号
 * @param carry 持越凸か判断するフラグ
 * @return 作成したリスト
 */
const createDeclareList = async (members: Member[], plans: Plan[], alpha: AtoE, carry: boolean): Promise<string[]> => {
  const convex = members.filter(m => new RegExp(alpha, 'gi').test(m.declare)).filter(m => m.carry === carry)

  // テキストを作成
  return convex.map(m => {
    const p = plans.find(p => p.playerID === m?.id)

    const convex = m.convex
    const over = '+'.repeat(m.over)
    const limit = m.limit !== '' ? `, ${m.limit}時` : ''

    return `${m.name}[${convex}${over}${limit}]${p ? ` ${p.msg}` : ''}`
  })
}

/**
 * 凸予定一覧を更新する
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 */
export const SetPlan = async (alpha: AtoE, state?: Current, channel?: Discord.TextChannel) => {
  state ??= await current.Fetch()
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].PLAN)
  const plans = await schedule.Fetch()
  const text = await plan.CreatePlanText(alpha, state.stage, plans)

  // 凸予定の前2行を取り除いて結合
  await msg.edit('凸予定\n```m\n' + text.split('\n').slice(2).join('\n'))
}
