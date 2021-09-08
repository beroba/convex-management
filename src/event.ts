import {MessageReaction} from 'discord.js'
import {Client} from './index'
import {GuildMemberAdd} from './client/guildMemberAdd'
import {GuildMemberUpdate} from './client/guildMemberUpdate'
import {InteractionCreate} from './client/interactionCreate'
import {MessageCreate} from './client/messageCreate'
import {MessageDelete} from './client/messageDelete'
import {MessageReactionAdd} from './client/messageReactionAdd'
import {MessageReactionRemove} from './client/messageReactionRemove'
import {MessageUpdate} from './client/messageUpdate'
import {Ready} from './client/ready'

/**
 * DiscordのAPIイベント一覧
 */
export const ClientEvent = () => {
  Client.on('ready', () => Ready())

  Client.on('guildMemberAdd', member => GuildMemberAdd(member))
  Client.on('guildMemberUpdate', (_, member) => GuildMemberUpdate(member))

  Client.on('interactionCreate', interaction => InteractionCreate(interaction))

  Client.on('messageCreate', msg => MessageCreate(msg))
  Client.on('messageDelete', msg => MessageDelete(msg))
  Client.on('messageReactionAdd', (react, user) => MessageReactionAdd(<MessageReaction>react, user))
  Client.on('messageReactionRemove', (react, user) => MessageReactionRemove(<MessageReaction>react, user))
  Client.on('messageUpdate', (_, msg) => MessageUpdate(msg))
}
