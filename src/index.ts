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

client.login(throwEnv('CAL_TOKEN'))
