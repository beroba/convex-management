import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as declare from './status'
import * as current from '../../io/current'
import * as damageList from '../../io/damageList'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Damage, Member, Plan} from '../../util/type'

/**
 * メンバーの凸宣言から凸宣言一覧を作る
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

  const noCarry = await createDeclareList(members, plans, alpha, false)
  const carry = await createDeclareList(members, plans, alpha, true)
  const list = [...noCarry, ...carry]

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
const createDeclareList = async (members: Member[], plans: Plan[], alpha: AtoE, carry: boolean): Promise<string[]> => {
  // テキストを作成
  return members
    .filter(m => new RegExp(alpha, 'gi').test(m.declare))
    .filter(m => m.carry === carry)
    .map(m => {
      const carry = m.carry ? '⭐' : ''

      const convex = m.convex
      const over = '+'.repeat(m.over)
      const limit = m.limit !== '' ? `, ${m.limit}時` : ''

      const p = plans.reverse().find(p => m?.id.find(n => n === p.playerID))
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

  const icon = boss.lap - state.lap >= 2 ? '🎁' : boss.lap - state.lap >= 1 ? '+1' : ''
  const bar = (percent => `[${'■'.repeat(percent)}${' '.repeat(20 - percent)}]`)(Math.ceil(20 * (HP / maxHP)))
  const full = declare.FullCarryOverDamage(HP, maxHP)
  const [total, remaining] = await declare.DamageCalc(HP, damages)

  const before = await createDamageList(damages, HP, members, false)
  const after = await createDamageList(damages, HP, members, true)

  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DAMAGE)
  const text = [
    'ダメージ集計 `⭕優先権(通したい)` `🆖事故・下振れ(通したくない)` `✅通し`',
    '```ts',
    `${boss.lap}周目 ${boss.name} ${icon}`,
    `${bar} ${HP}/${maxHP}, フル持越: ${full}`,
    `合計ダメージ: ${total}, 予想残り: ${remaining}`,
    '',
    '- ダメージ一覧',
    `${before.join('\n')}`,
    ' ―――――― 確定済 ――――――',
    `${after.join('\n')}`,
    '```',
  ].join('\n')
  await msg.edit(text)
}

/**
 * ダメージ集計一覧のリストを作成する
 * @param damages ダメージ一覧
 * @param HP ボスの残りHP
 * @param members メンバー全体の状態
 * @param already 確定済か否かの判定
 * @return 作成したリスト
 */
const createDamageList = async (
  damages: Damage[],
  HP: number,
  members: Member[],
  already: Boolean
): Promise<string[]> => {
  return damages
    .filter(d => d.already === already)
    .map(d => {
      const m = members.find(m => m.id.find(n => n === d.id))
      if (!m) return ''

      const _ = d.exclusion ? '_' : ' '
      const carry = m.carry ? '⭐' : ''
      const convex = m.convex
      const over = '+'.repeat(m.over)
      const limit = m.limit !== '' ? `, ${m.limit}時` : ''

      const flag = Settings.DAMAGE_FLAG[d.flag]
      const damage = d.damage || '    '
      const time = d.time || '  '
      const calc = m.carry || d.already ? '不可' : declare.CalcCarryOver(HP, d.damage)
      const text = d.text && `'${d.text}'`

      return [
        `${_}${d.num}: ${carry}${d.name}[${convex}${over}${limit}], ${d.date}`,
        `${flag}| ${damage.padStart(4, ' ')},${time.padStart(2, ' ')}秒 | 持越:${calc} | ${text}`,
      ].join('\n')
    })
}
