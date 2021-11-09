import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as over from '../over'
import * as plan from '../plan/delete'
import * as dateTable from '../../io/dateTable'
import * as util from '../../util'

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与する
 */
export const SetRemainConvex = async () => {
  // クラバトの日じゃない場合は終了
  const date = await dateTable.TakeDate()
  if (date.num === '練習日') return

  // べろばあのクランメンバー一覧を取得
  const clanMembers = util
    .GetGuild()
    ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => m)

  clanMembers?.forEach(m => m?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('クランメンバーに凸残ロールを付与したわ')

  console.log('Add convex role')
}

/**
 * 凸残ロールを全て外す
 */
export const RemoveConvexRoles = async () => {
  // べろばあのクランメンバー一覧を取得
  const clanMembers =
    util
      .GetGuild()
      ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
      ?.members.map(m => m) ?? []

  // クランメンバーの凸残ロールを全て外す
  await Promise.all(clanMembers.map(async m => await m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)))
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
export const ResetAllConvex = () => {
  plan.DeleteAll()

  over.DeleteAllMsg()

  // べろばあのクランメンバー一覧を取得
  const clanMembers = util
    .GetGuild()
    ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => m)

  clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))
}
