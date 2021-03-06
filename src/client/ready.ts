// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')
  // const msg = await channel.send('きゃるきゃるーん')

  // msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname('キャルは悪い子')

  // const c = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)
  // await c.send('凸予定')
  // await c.send('凸宣言')
  // await c.send('残りHP')

  console.log(`Logged in as ${Client.user?.username}!`)
}
