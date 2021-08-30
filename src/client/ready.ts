// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as react from './convex/react'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  // 起動通知を送る
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  // {
  //   const channel = util.GetTextChannel('714020537231343656')
  //   const row = new Discord.MessageActionRow().addComponents(
  //     new Discord.MessageButton().setCustomId('primary').setLabel('すまいるを褒める').setStyle('PRIMARY')
  //   )
  //   channel.send({content: '↓押してね', components: [row]})
  // }

  console.log(`Logged in as ${Client.user?.username}!`)
}
