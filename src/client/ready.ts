import * as Discord from 'discord.js'
import throwEnv from 'throw-env'
import Settings from 'const-settings'

/**
 * キャルが起動した際に通知を送る
 * @param client bot(キャル)のclient
 */
export const Ready = (client: Discord.Client) => {
  const channel = client.channels.cache.get(throwEnv('NOTIFY_CHANNEL_ID')) as Discord.TextChannel
  channel?.send(Settings.STARTUP_MESSAGE)
  console.log(`Logged in as ${client.user?.username}!`)
}
