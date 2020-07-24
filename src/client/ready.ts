import * as Discord from 'discord.js'
import Settings from 'const-settings'

/**
 * キャルが起動した際に通知を送る
 * @param client bot(キャル)のclient
 */
export const Ready = (client: Discord.Client) => {
  const channel = client.channels.cache.get(Settings.STARTUP.CHANNEL_ID) as Discord.TextChannel
  channel?.send(Settings.STARTUP.MESSAGE)

  console.log(`Logged in as ${client.user?.username}!`)
}
