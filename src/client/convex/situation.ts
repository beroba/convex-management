import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'

export const Report = async (client: Discord.Client) => {
  const channel = util.GetTextChannel(Settings.CONVEX_CHANNEL.SITUATION_ID, client)
  channel.send('test')
}
