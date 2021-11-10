import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {AtoE, Current, CurrentBoss, Member} from '../../util/type'

/**
 * 残りの凸状況を報告する
 * @param members メンバー全員の状態
 * @param member メンバーの状態
 * @param carry 持越か否かの真偽値
 * @param state 現在の状況
 * @param alpha ボスの番号
 * @param overMsgs メンバーの持越状況のメッセージ一覧
 * @param content 凸報告のメッセージ
 * @param msg DiscordからのMessage
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
): Promise<string> => {
  const boss = state[alpha]

  const HP = content ? content.replace(/@/g, '').to_n() : boss.hp
  const maxHP = Settings.STAGE[state.stage].HP[alpha]

  // prettier-ignore
  const text = [
    warningText(),
    '```ts',
    bossInfo(boss, state, HP, maxHP),
    convexInfo(boss, carry, HP),
    userInfo(members, member),
    '```',
  ].join('\n')

  await msg.reply(text)

  return content
}

/**
 * 警告文のテキストを作成
 * @return 作成したテキスト
 */
const warningText = (): string => {
  // channel.send(`<@!${member.id}> <#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> を整理してね`)
  return [].join('\n')
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
    `${boss.lap}周目 ${boss.name} ${icon}`,
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
    carry ? '通常凸' : '持越凸',
    `HP: ${boss.hp}→${damage ? HP : '不明'}, ダメージ: ${damage || '不明'}`,
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
    member.end ? `${getCurrentDate()} ${endNum}人目の3凸終了よ！` : '',
  ].join('\n')
}

/**
 * 現在の時刻を取得
 * @return 取得した文字列
 */
const getCurrentDate = (): string => {
  const d = new Date()
  const HH = d.getHours().padStart(2, '0')
  const mm = d.getMinutes().padStart(2, '0')
  return `${HH}:${mm}`
}
