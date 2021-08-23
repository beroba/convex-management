import './util/prototype'
import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Partials, Intents} from './util/setting'
import {Ready} from './client/ready'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {GuildMemberUpdate} from './client/guildMemberUpdate'
import {MessageCreate} from './client/messageCreate'
import {MessageDelete} from './client/messageDelete'
import {MessageReactionAdd} from './client/messageReactionAdd'
import {MessageReactionRemove} from './client/messageReactionRemove'
import {MessageUpdate} from './client/messageUpdate'
import {CronOperation} from './util/cron'

// クライアントの作成
export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

// APIトリガー
Client.on('ready', () => Ready())

Client.on('guildMemberAdd', member => GuildMemberAdd(member))

Client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member))

Client.on('messageCreate', msg => MessageCreate(msg))

Client.on('messageDelete', msg => MessageDelete(msg))

Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(<Discord.MessageReaction>react, user))

Client.on('messageReactionRemove', (react, user) => MessageReactionRemove(<Discord.MessageReaction>react, user))

Client.on('messageUpdate', (_, msg) => MessageUpdate(msg))

// クーロン処理
CronOperation()

// ログイン
const token = ThrowEnv('CAL_TOKEN')
Client.login(token)
