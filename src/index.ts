import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {Message} from './client/message'

const client = new Discord.Client()

// botの起動時に実行
client.on('ready', () => Ready(client))

// 新しいメンバーが増えた際に実行
client.on('guildMemberAdd', member => GuildMemberAdd(client, member as Discord.GuildMember))

// メッセージが送信された際に実行
client.on('message', msg => Message(msg))

client.login(ThrowEnv('CAL_TOKEN'))
