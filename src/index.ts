import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {GuildMemberUpdate} from './client/guildMemberUpdate'
import {Message} from './client/message'
import {SetRemainConvex} from './util/cron'

export const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']})

// botの起動時に実行
client.on('ready', () => Ready(client))

// 新しいメンバーが増えた際に実行
client.on('guildMemberAdd', member => GuildMemberAdd(client, member as Discord.GuildMember))

// メンバーの状態が変わった際に実行
client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member as Discord.GuildMember))

// メッセージが送信された際に実行
client.on('message', msg => Message(client, msg))

// 朝5時に凸残りロールを付与する
SetRemainConvex(client)

client.login(ThrowEnv('CAL_TOKEN'))
