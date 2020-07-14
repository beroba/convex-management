import * as Discord from 'discord.js'
import throwEnv from 'throw-env'

/**
 * キャルが起動した際に通知を送る
 * @param client bot(キャル)のclient
 */
export const Ready = (client: Discord.Client) => {
  const channel = client.channels.cache.get(throwEnv('CHANNEL_CALL_ID')) as Discord.TextChannel
  channel?.send('キャルの参上よ！')
  console.log(`Logged in as ${client.user?.username}!`)
}
