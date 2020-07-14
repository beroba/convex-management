import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'

const client = new Discord.Client()

// botの起動時に実行
client.on('ready', () => Ready(client))

// 新しいメンバーが増えた際に実行
client.on('guildMemberAdd', (member: Discord.GuildMember | Discord.PartialGuildMember) =>
  GuildMemberAdd(client, member)
)

client.on('message', (msg: Discord.Message) => {
  if (msg.guild?.id !== throwEnv('CLAN_SERVER_ID')) return

  if (msg.content !== 'やばい') return

  const yabai =
    'https://raw.githubusercontent.com/smicle/smicle-line-bot/assets/assets/%E3%83%A4%E3%83%90%E3%82%A4%E3%82%8F%E3%82%88%EF%BC%81.png'
  msg.channel.send('', {files: [yabai]})
})

client.login(throwEnv('CAL_TOKEN'))
