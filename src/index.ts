import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import Settings from 'const-settings'

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.username}!`)
})

client.on('guildMemberAdd', member => {
  // ウェルカムメッセージしないサーバなら終了
  if (member.guild.name !== Settings.WELCOME_SERVER) return

  const channel = client.channels.cache.get(throwEnv('WELCOME_CHANNEL_ID')) as Discord.TextChannel
  channel?.send(`<@!${member.user?.id}> まずは <#${throwEnv('GUIDE_CHANNEL_ID')}> を確認しなさい！`)
})

client.login(throwEnv('CAL_TOKEN'))
