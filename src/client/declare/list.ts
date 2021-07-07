import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {AtoE, Current, Member, Plan} from '../../io/type'
import * as plan from '../plan/list'

/**
 * 凸宣言にリアクションしているユーザーから凸宣言一覧を作る
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 * @param members メンバー全体の状態
 */
export const SetUser = async (alpha: AtoE, channel?: Discord.TextChannel, members?: Member[]) => {
  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // メンバー全体の状態を取得
  members ??= await status.Fetch()

  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)

  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(alpha)

  // 凸宣言者一覧を作成
  const totu = await createDeclareList(members, plans, alpha, false)
  const mochikoshi = await createDeclareList(members, plans, alpha, true)

  // 凸宣言のメッセージを作成
  const text = [
    '凸宣言 `[現在の凸数(+は持越), 活動限界時間]`',
    '```',
    '――――凸宣言――――',
    `${totu.join('\n')}${totu.length ? '\n' : ''}`,
    '――――持越凸――――',
    `${mochikoshi.join('\n')}`,
    '```',
  ].join('\n')

  // 凸宣言のメッセージを編集
  msg.edit(text)
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
  const convex = members.filter(m => m.declare === alpha).filter(m => m.carry === carry)

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
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // 凸予定のメッセージを取得
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].PLAN)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await plan.CreatePlanText(alpha, state.stage, plans)

  // 凸予定一覧を更新
  // 1行目を取り除く
  msg.edit('凸予定\n' + text.split('\n').slice(1).join('\n'))
}
