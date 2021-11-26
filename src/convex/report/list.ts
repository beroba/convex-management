import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import {AtoE, Current, CurrentBoss, Member} from '../../util/type'

/**
 * 残りの凸状況を報告する
 * @param msg DiscordからのMessage
 * @param members メンバー全員の状態
 * @param member メンバーの状態
 * @param carry 持越か否かの真偽値
 * @param state 現在の状況
 * @param alpha ボスの番号
 * @param overMsgs メンバーの持越状況のメッセージ一覧
 * @param content 凸報告のメッセージ
 */
export const Reply = async (
  members: Member[],
  member: Member,
  carry: boolean,
  state: Current,
  alpha: AtoE,
  overMsgs: Discord.Message[],
  content: string,
  msg: Discord.Message
) => {
  const boss = state[alpha]

  const HP = content ? content.replace(/@/g, '').to_n() : boss.hp
  const maxHP = Settings.STAGE[state.stage].HP[alpha]

  // prettier-ignore
  const text = [
    warningText(alpha, content, carry, overMsgs, msg),
    '```ts',
    bossInfo(boss, state, HP, maxHP),
    convexInfo(boss, carry, HP),
    userInfo(members, member),
    '```',
  ].join('\n')

  await msg.reply(text)
}

/**
 * 警告文のテキストを作成
 * @return 作成したテキスト
 */
const warningText = (
  alpha: AtoE,
  content: string,
  carry: boolean,
  overMsgs: Discord.Message[],
  msg: Discord.Message
): string => {
  const texts: string[] = []

  const c = util.Format(msg.content)

  if (/^k$/i.test(c)) {
    const text = '`k`じゃなくてちゃんと`kill`って入力しなさい！'
    texts.push(text)
  }

  if (carry) {
    if (overMsgs.length >= 2) {
      const text = `<#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> に複数メッセージがあるから整理してね`
      texts.push(text)
    }
  } else if (content === '@0') {
    const text = `<#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> に編成や秒数を記載してね`
    texts.push(text)
  }

  if (/^\d$/.test(c)) {
    const text = '数字(残りHP)の前に`@`を付けてね (例:`@3800`)'
    texts.push(text)

    if (!content) {
      const text = `<#${Settings.DECLARE_CHANNEL_ID[alpha]}> に\`/h${c}\`というメッセージを送信してHPを変更してね`
      texts.push(text)
    }
  } else if (!content) {
    const text = [
      'ボスを倒していない場合は、`@残りHP`で凸報告してね (例:`@3800`)',
      `<#${Settings.DECLARE_CHANNEL_ID[alpha]}> でボスのHPを修正してなさい！`,
      '残りHP3800の場合は`/h3800`というメッセージを送信するとHPが変更できるわよ',
    ].join('\n')
    texts.push(text)
  }

  return texts.join('\n')
}

/**
 * ボス情報のテキストを作成
 * @return 作成したテキスト
 */
const bossInfo = (boss: CurrentBoss, state: Current, HP: number, maxHP: number): string => {
  const percent = Math.ceil(20 * (HP / maxHP))
  const bar = `[${'■'.repeat(percent)}${' '.repeat(20 - percent)}]`
  const icon = boss.lap - state.lap >= 2 ? '🎁' : boss.lap - state.lap >= 1 ? '+1' : ''
  // prettier-ignore
  return [
    `${util.GetCurrentDate()} ${boss.lap}周目 ${boss.name} ${icon}`,
    `${bar} ${HP}/${maxHP}`,
    '',
  ].join('\n')
}

/**
 * 凸情報のテキストを作成
 * @return 作成したテキスト
 */
const convexInfo = (boss: CurrentBoss, carry: boolean, HP: number): string => {
  const damage = boss.hp - HP
  // prettier-ignore
  return [
    `- ${carry ? '通常' : '持越'}凸`,
    `HP: ${boss.hp} → ${damage ? HP : '不明'}, ダメージ: ${damage || '不明'}`,
    '',
].join('\n')
}

/**
 * ユーザー情報のテキストを作成
 * @param members メンバー全員の状態
 * @param member メンバーの状態
 * @return 作成したテキスト
 */
const userInfo = (members: Member[], member: Member): string => {
  const endNum = members.filter(s => s.end).length
  // prettier-ignore
  return [
    `残凸数: ${member.convex}, 持越数: ${member.over}`,
    member.end ? `${endNum}人目の3凸終了よ！` : '',
  ].join('\n')
}
