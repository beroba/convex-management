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
  // const m = await channel.send('きゃるきゃるーん')
  // m.member?.setNickname('キャル')

  // const c = util.GetTextChannel('795629249754431488')
  // const m = await c.send('a')
  // m.react(Settings.EMOJI_ID.SHUSEKI)
  // m.react(Settings.EMOJI_ID.RISEKI)

  console.log(`Logged in as ${Client.user?.username}!`)
}
