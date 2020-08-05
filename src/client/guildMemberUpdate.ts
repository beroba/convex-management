import * as Discord from 'discord.js'
import Settings from 'const-settings'

export const GuildMemberUpdate = (member: Discord.GuildMember) => {
  const bool = member.guild.roles.cache.get(Settings.ROLE_ID.YABAIWAYO)?.members.some(m => m.user === member.user)
  if (!bool) return

  if (member.user.id === Settings.ADMIN_ID) return

  member.roles.remove(Settings.ROLE_ID.YABAIWAYO)
  console.log('Delete yabaiwayo Role')
}
