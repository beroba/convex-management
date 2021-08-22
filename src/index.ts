import './util/prototype'
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

const FLAGS = Discord.Intents.FLAGS

export const Client = new Discord.Client({
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  intents: [
    FLAGS.GUILDS,
    FLAGS.GUILD_MEMBERS,
    FLAGS.GUILD_BANS,
    FLAGS.GUILD_EMOJIS_AND_STICKERS,
    FLAGS.GUILD_INTEGRATIONS,
    FLAGS.GUILD_WEBHOOKS,
    FLAGS.GUILD_INVITES,
    FLAGS.GUILD_VOICE_STATES,
    FLAGS.GUILD_PRESENCES,
    FLAGS.GUILD_MESSAGES,
    FLAGS.GUILD_MESSAGE_REACTIONS,
    FLAGS.GUILD_MESSAGE_TYPING,
    FLAGS.DIRECT_MESSAGES,
    FLAGS.DIRECT_MESSAGE_REACTIONS,
    FLAGS.DIRECT_MESSAGE_TYPING,
  ],
})

// botの起動時に実行
Client.on('ready', () => Ready())

// 新しいメンバーが増えた際に実行
Client.on('guildMemberAdd', member => GuildMemberAdd(member))

// メンバーの状態が変わった際に実行
Client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member))

// メッセージが送信された際に実行
Client.on('messageCreate', msg => Message(msg))

// メッセージが削除された際に実行
Client.on('messageDelete', msg => MessageDelete(msg))

// リアクションが付与された際に実行
Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(<Discord.MessageReaction>react, user))

// リアクションを外した際に実行
Client.on('messageReactionRemove', (react, user) => MessageReactionRemove(<Discord.MessageReaction>react, user))

// メッセージが更新された際に実行
Client.on('messageUpdate', (_, msg) => MessageUpdate(msg))

// クーロンの処理
CronOperation()

Client.login(ThrowEnv('CAL_TOKEN'))
