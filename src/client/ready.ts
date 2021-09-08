// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as react from '../convex/react'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  console.log(`Logged in as ${Client.user?.username}!`)
}
