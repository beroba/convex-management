import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as fetch from '../util/fetch'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  // 起動通知を送る
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  const msg = await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  fetch.React()

  // {
  //   const channel = util.GetTextChannel('724824329413722173')
  //   const msg = await channel.messages.fetch('822685685784772648')
  //   msg.react('822685074666684416')
  // }

  msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname('キャル')

  console.log(`Logged in as ${Client.user?.username}!`)
}
