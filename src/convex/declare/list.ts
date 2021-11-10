import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as declare from './status'
import * as plan from '../plan/list'
import * as current from '../../io/current'
import * as damageList from '../../io/damageList'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Damage, Member, Plan} from '../../util/type'

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
  await msg.edit('凸予定\n```ts\n' + text.split('\n').slice(2).join('\n'))
}

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

  const list = await createDeclareList(members, plans, alpha)

  const text = [
    '凸宣言 `⭐持越` `[残凸数(+は持越), 活動限界時間]`',
    '```ts',
    `- 宣言者 ${list.length}人`,
    `${list.join('\n')}`,
    '```',
  ].join('\n')
  await msg.edit(text)
}

/**
 * 凸宣言一覧のリストを作成する
 * @param members メンバー全体の状態
 * @param plans 凸予定一覧
 * @param alpha ボス番号
 * @return 作成したリスト
 */
const createDeclareList = async (members: Member[], plans: Plan[], alpha: AtoE): Promise<string[]> => {
  // テキストを作成
  return members
    .filter(m => new RegExp(alpha, 'gi').test(m.declare))
    .map(m => {
      const carry = m.carry ? '⭐' : ''

      const convex = m.convex
      const over = '+'.repeat(m.over)
      const limit = m.limit !== '' ? `, ${m.limit}時` : ''

      const p = plans.find(p => p.playerID === m?.id)
      const msg = p ? ` ${p.msg}` : ''

      return `${carry}${m.name}[${convex}${over}${limit}]${msg}`
    })
}

/**
 * ダメージ集計を変更する
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 * @param damages ダメージ一覧
 * @param members メンバー全体の状態
 */
export const SetDamage = async (
  alpha: AtoE,
  state?: Current,
  channel?: Discord.TextChannel,
  damages?: Damage[],
  members?: Member[]
) => {
  state ??= await current.Fetch()
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  damages ??= await damageList.FetchBoss(alpha)
  members ??= await status.Fetch()

  const boss = state[alpha]

  const HP = boss.hp
  const maxHP = Settings.STAGE[state.stage].HP[alpha]
  const percent = Math.ceil(20 * (HP / maxHP))
  const bar = `[${'■'.repeat(percent)}${' '.repeat(20 - percent)}]`

  const icon = boss.lap - state.lap >= 2 ? '🎁' : boss.lap - state.lap >= 1 ? '+1' : ''

  const total = await declare.TotalDamage(damages)

  const list = await createDamageList(damages, HP, members)

  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DAMAGE)
  const text = [
    'ダメージ集計 `⭕通したい` `🆖事故・通したくない` `✅通し`',
    '```ts',
    `${boss.lap}周目 ${boss.name} ${icon}`,
    `${bar} ${HP}/${maxHP}`,
    `ダメージ合計: ${total}, 予想残りHP: ${declare.ExpectRemainingHP(HP, total)}`,
    '',
    '- ダメージ一覧',
    `${list.join('\n')}`,
    '```',
  ].join('\n')
  await msg.edit(text)
}

/**
 * ダメージ集計一覧のリストを作成する
 * @param damages ダメージ一覧
 * @param HP ボスの残りHP
 * @param members メンバー全体の状態
 * @return 作成したリスト
 */
const createDamageList = async (damages: Damage[], HP: number, members: Member[]): Promise<string[]> => {
  return damages.map(d => {
    const m = members.find(m => m.id === d.id)
    if (!m) return ''

    const _ = d.exclusion ? '_' : ''
    const carry = m.carry ? '⭐' : ''

    const convex = m.convex
    const over = '+'.repeat(m.over)
    const limit = m.limit !== '' ? `, ${m.limit}時` : ''

    const flag = Settings.DAMAGE_FLAG[d.flag]

    const damage = d.damage || '不明'
    const time = d.time ? `${d.time}秒` : '不明'
    const calc = declare.CalcCarryOver(HP, d.damage)

    // prettier-ignore
    return [
      `${_}${d.num}: ${carry}${d.name}[${convex}${over}${limit}] '${d.text}'`,
      `${flag}| ダメージ: ${damage} | 秒数: ${time} | 持越: ${calc}`
    ].join('\n')
  })
}
