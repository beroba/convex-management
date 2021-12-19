import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as over from '../over'
import * as plan from '../plan/delete'
import * as dateTable from '../dateTable'
import * as status from '../../io/status'
import * as util from '../../util'

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与する
 */
export const SetRemainConvex = async () => {
  // クラバトの日じゃない場合は終了
  const date = await dateTable.TakeDate()
  if (date.num === '練習日') return

  const members = await status.Fetch()
  const guildMembers = await Promise.all(members.map(m => util.MemberFromId(m.id.first())))
  guildMembers.forEach(m => m.roles.add(Settings.ROLE_ID.REMAIN_CONVEX))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send(`${date.num} クランメンバーに凸残ロールを付与したわ`)

  console.log('Add convex role')
}

/**
 * 3凸終了していない人に凸残ロールを付与する
 */
export const ResetRemainConvex = async () => {
  const members = await status.Fetch()

  const addMembers = await Promise.all(members.filter(m => !m.end).map(m => util.MemberFromId(m.id.first())))
  addMembers.forEach(m => m.roles.add(Settings.ROLE_ID.REMAIN_CONVEX))

  const removeMembers = await Promise.all(members.filter(m => m.end).map(m => util.MemberFromId(m.id.first())))
  removeMembers.forEach(m => m.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('クランメンバーの凸残ロールを付与し直したわ')
}

/**
 * 凸残ロールを全て外す
 */
export const RemoveRemainConvex = async () => {
  const members = await status.Fetch()
  const guildMembers = await Promise.all(members.map(m => util.MemberFromId(m.id.first())))
  guildMembers.forEach(m => m.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))
}

/**
 * 指定されたメンバーのボスロールを全て削除する
 * @param member ロールを削除したメンバー
 */
export const RemoveBossRole = async (member: Option<Discord.GuildMember>) => {
  await member?.roles.remove(Settings.BOSS_ROLE_ID.a)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.b)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.c)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.d)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.e)
}

/**
 * 凸予定、持越、凸残ロールを全て削除する
 */
export const ResetAllConvex = async () => {
  plan.DeleteAll()

  over.DeleteAllMsg()

  const members = await status.Fetch()
  const guildMembers = await Promise.all(members.map(m => util.MemberFromId(m.id.first())))
  guildMembers.forEach(m => m.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('凸予定、持越、凸残ロールを全て削除したわ')
}
