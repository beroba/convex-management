// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  // const cn = Client.channels.cache
  //   .map(c => c as Discord.TextChannel | Discord.VoiceChannel)
  //   .filter(c => c.guild.id === '714020537231343653')

  // cn.forEach(c => {
  //   console.log(c.name)
  //   console.log(c.id)
  // })

  console.log(`Logged in as ${Client.user?.username}!`)
}
