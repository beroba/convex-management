import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {GuildMemberUpdate} from './client/guildMemberUpdate'
import {Message} from './client/message'
import {MessageDelete} from './client/messageDelete'
import {MessageReactionAdd} from './client/messageReactionAdd'
import {MessageReactionRemove} from './client/messageReactionRemove'
import {MessageUpdate} from './client/messageUpdate'
import {CronOperation} from './util/cron'

export const Client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: {intents: Discord.Intents.ALL},
})

// botの起動時に実行
Client.on('ready', () => Ready())

// 新しいメンバーが増えた際に実行
Client.on('guildMemberAdd', member => GuildMemberAdd(member))

// メンバーの状態が変わった際に実行
Client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member))

// メッセージが送信された際に実行
Client.on('message', msg => Message(msg))

// メッセージが削除された際に実行
Client.on('messageDelete', msg => MessageDelete(msg))

// リアクションが付与された際に実行
Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(react, user))

// リアクションを外した際に実行
Client.on('messageReactionRemove', (react, user) => MessageReactionRemove(react, user))

// メッセージが更新された際に実行
Client.on('messageUpdate', (_, msg) => MessageUpdate(msg))

// クーロンの内容
CronOperation()

Client.login(ThrowEnv('CAL_TOKEN'))
