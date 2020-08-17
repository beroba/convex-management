import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 * @param client bot(キャル)のclient
 */
export const Ready = (client: Discord.Client) => {
  const channel = util.GetTextChannel(Settings.STARTUP.CHANNEL_ID, client)
  channel.send(Settings.STARTUP.MESSAGE)

  console.log(`Logged in as ${client.user?.username}!`)
}
