import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'
import {Member} from '../../io/type'
import * as limitTime from './limitTime'
import * as situation from './situation'

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param arg プレイヤーidと凸状況
 * @param msg DiscordからのMessage
 */
export const Update = async (arg: string, msg: Discord.Message) => {
  // 凸状況を取得
  const state = util.Format(arg).replace(/<.+>/, '').trim()

  // 凸状況の書式がおかしい場合は終了
  if (!/^(0|[1-3]\+?)$/.test(state)) {
    msg.reply('凸状況の書式が違うわ')
    return
  }

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
  if (state === '3') {
    member = await convexEndProcess(member, user, msg)
  } else {
    member = await updateProcess(member, state, user, msg)
  }

  // ステータスを更新
  const members = await status.UpdateMember(member)
  await util.Sleep(100)

  // 凸状況をスプレッドシートに反映
  status.ReflectOnSheet(member)

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
  member.convex = '3'
  member.over = ''
  member.end = '1'

  // 凸残ロールを削除
  const guildMember = await util.MemberFromId(user.id)
  guildMember.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const members = await status.Fetch()
  const n = members.filter(s => s.end === '1').length + 1
  msg.reply(`3凸目 終了\n\`${n}\`人目の3凸終了よ！`)

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
  member.convex = state[0] === '0' ? '' : state[0]
  member.over = state.includes('+') ? '1' : ''
  member.end = ''

  // 凸残ロールを付与
  const guildMember = await util.MemberFromId(user.id)
  guildMember.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)

  // 凸状況を報告する
  msg.reply(member.convex ? `${member.convex}凸目 ${member.over ? '持ち越し' : '終了'}` : '未凸')

  return member
}
