import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import Settings from 'const-settings'

export const GuildMemberAdd = (
  client: Discord.Client,
  member: Discord.GuildMember | Discord.PartialGuildMember
) => {
  console.log(member.guild.id)
  // ウェルカムメッセージしないサーバなら終了
  if (member.guild.name !== Settings.WELCOME_SERVER) return

  const channel = client.channels.cache.get(throwEnv('WELCOME_CHANNEL_ID')) as Discord.TextChannel
  channel?.send(`<@!${member.user?.id}> まずは <#${throwEnv('GUIDE_CHANNEL_ID')}> を確認しなさい！`)
}
