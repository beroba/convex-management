import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as damageList from '../../io/damageList'
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
  const damages = await damageList.FetchBoss(alpha)
  damages
  overMsgs

  const boss = state[alpha]

  // 凸報告のメッセージからHPを取得
  let hp: Option<number | string> = content
    .replace(/^.*@/g, '')
    .trim()
    .replace(/\s.*$/g, '')
    .match(/\d*/)
    ?.map(e => e)
    .first()
  hp = hp === '' || hp === undefined ? boss.hp : hp
  const maxHP = Settings.STAGE[state.stage].HP[alpha]

  // 何人3凸終了しているか確認
  const endN = members.filter(s => s.end).length

  // channel.send(`<@!${member.id}> <#${Settings.CHANNEL_ID.CARRYOVER_SITUATION}> を整理してね`)

  const text = [
    '```m',
    `${boss.lap}周目 ${boss.name} ${hp}/${maxHP}`,
    `残凸数: ${member.convex}、持越数: ${member.over}`,
    member.end ? `${endN}人目の3凸終了よ！` : '',
    '```',
  ].join('\n')

  await msg.reply(text)

  return content
}
