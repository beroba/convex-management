import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {GuildMemberUpdate} from './client/guildMemberUpdate'
import {Message} from './client/message'
import {SetRemainConvex} from './util/cron'

export const Client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']})

// botの起動時に実行
Client.on('ready', () => Ready())

// 新しいメンバーが増えた際に実行
Client.on('guildMemberAdd', member => GuildMemberAdd(member))

// メンバーの状態が変わった際に実行
Client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member))

// メッセージが送信された際に実行
Client.on('message', msg => Message(msg))

// 朝5時に凸残りロールを付与する
SetRemainConvex()

Client.login(ThrowEnv('CAL_TOKEN'))
