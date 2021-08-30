import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as role from './role'
import * as situation from './situation'
import * as limit from './time/limit'
import * as status from '../io/status'
import * as util from '../util'
import {Member} from '../util/type'

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param state 更新先の凸状況
 * @param msg DiscordからのMessage
 */
export const Update = async (state: string, msg: Discord.Message) => {
  // 凸状況を更新するユーザーを取得する
  const user = msg.mentions.users.first()
  if (!user) {
    msg.reply('メンションで誰の凸状況を変更したいか指定しなさい')
    return
  }

  let member = await status.FetchMember(user.id)
  if (!member) {
    msg.reply('その人はクランメンバーじゃないわ')
    return
  }

  // 3凸終了とそれ以外に処理を分ける
  if (state === '0') {
    member = await convexEndProcess(member, user, msg)
  } else {
    member = await updateProcess(member, state, user, msg)
  }

  const members = await status.UpdateMember(member)

  situation.Report(members)
}

/**
 * 3凸状態に更新する処理
 * @param member 更新するメンバー
 * @param user 更新したいユーザー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
const convexEndProcess = async (member: Member, user: Discord.User, msg: Discord.Message): Promise<Member> => {
  // 凸状況を変更
  member.convex = 0
  member.over = 0
  member.end = true

  // ロールを削除
  const guildMember = await util.MemberFromId(user.id)
  await guildMember.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
  await role.RemoveBossRole(guildMember)

  // 何人目の3凸終了者なのかを報告する
  const members = await status.Fetch()
  const n = members.filter(s => s.end).length + 1
  // prettier-ignore
  const text = [
    '```',
    `残凸数: 0、持越数: 0`,
    `${n}人目の3凸終了よ！`,
    '```',
  ].join('\n')
  await msg.reply(text)

  limit.Display(members)

  return member
}

/**
 * 凸状況を更新する処理
 * @param member 更新するメンバー
 * @param state 更新する凸状況
 * @param user 更新したいユーザー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
const updateProcess = async (
  member: Member,
  state: string,
  user: Discord.User,
  msg: Discord.Message
): Promise<Member> => {
  // 凸状況を変更
  member.convex = state[0].to_n()
  member.over = state.match(/\+/g) ? <number>state.match(/\+/g)?.length : 0
  member.end = false
  member.declare = ''
  member.carry = false

  const guildMember = await util.MemberFromId(user.id)
  await guildMember.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)

  // prettier-ignore
  const text = [
    '```',
    `残凸数: ${member.convex}、持越数: ${member.over}`,
    '```',
  ].join('\n')

  await msg.reply(text)

  return member
}
