import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {AtoE, Current, Member} from '../../util/type'

/**
 * 残りの凸状況を報告する
 * @param members メンバー全員の状態
 * @param member メンバーの状態
 * @param state 現在の状況
 * @param alpha ボスの番号
 * @param overMsgs メンバーの持越状況のメッセージ一覧
 * @param content 凸報告のメッセージ
 * @param msg DiscordからのMessage
 */
export const Reply = async (
  members: Member[],
  member: Member,
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
    convexInfo(),
    bossInfo(),
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
 * 凸情報のテキストを作成
 * @return 作成したテキスト
 */
const convexInfo = (): string => {
  return [].join('\n')
}

/**
 * ボス情報のテキストを作成
 * @return 作成したテキスト
 */
const bossInfo = (): string => {
  // `${boss.lap}周目 ${boss.name} ${HP}/${maxHP}`,
  return [].join('\n')
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
    `残凸数: ${member.convex}、持越数: ${member.over}`,
    member.end ? `${getCurrentDate()} ${endNum}人目の3凸終了よ！` : '',
  ].join('\n')
}

/**
 * 現在の時刻を取得
 * @return 取得した文字列
 */
const getCurrentDate = (): string => {
  const p0 = (n: number): string => n.to_s().padStart(2, '0')
  const d = new Date()
  return `${p0(d.getHours())}:${p0(d.getMinutes())}`
}
