import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'
import {Member} from '../../io/type'
import * as limitTime from './limitTime'
import * as situation from './situation'

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

  // メンバーの状態を取得
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

  // ステータスを更新
  const members = await status.UpdateMember(member)
  await util.Sleep(100)

  // 凸状況に報告
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
  member.end = '1'

  // ロールを削除
  const guildMember = await util.MemberFromId(user.id)
  await guildMember.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
  await guildMember.roles.remove(Settings.ROLE_ID.PLAN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const members = await status.Fetch()
  const n = members.filter(s => s.end === '1').length + 1
  msg.reply(`残凸数: 0、持越数: 0\n\`${n}\`人目の3凸終了よ！`)

  // 活動限界時間の表示を更新
  limitTime.Display(members)

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
  member.end = ''
  member.declare = ''
  member.carry = false

  // 凸残ロールを付与
  const guildMember = await util.MemberFromId(user.id)
  guildMember.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)

  // 凸状況を報告する
  msg.reply(`残凸数: ${member.convex}、持越数: ${member.over}`)

  return member
}
