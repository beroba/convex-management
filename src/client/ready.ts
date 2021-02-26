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

  // const c = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLAR)
  // await c.send('凸予定')
  // await c.send('凸宣言')
  // m.member?.setNickname('キャル')

  console.log(`Logged in as ${Client.user?.username}!`)
}
