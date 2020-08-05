import * as Discord from 'discord.js'
import Settings from 'const-settings'

export const GuildMemberUpdate = (member: Discord.GuildMember) => {
  // ヤバイわよのロールがついて居ない場合終了
  const bool = member.guild.roles.cache.get(Settings.ROLE_ID.YABAIWAYO)?.members.some(m => m.user === member.user)
  if (!bool) return

  // キャルbotの管理者ならロールを削除せずに終了
  if (member.user.id === Settings.ADMIN_ID) return

  // ヤバイわよ！ロールを削除する
  member.roles.remove(Settings.ROLE_ID.YABAIWAYO)
  console.log('Delete yabaiwayo Role')
}
