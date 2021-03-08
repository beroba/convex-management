import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname('キャルは悪い子')

  console.log(`Logged in as ${Client.user?.username}!`)
}
