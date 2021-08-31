import Settings from 'const-settings'
import {Client} from '../index'
import * as react from '../convex/react'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  // 起動通知を送る
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  {
    // const channel = util.GetTextChannel('739410182693453844')
    // console.log(channel.guild.channels.cache.map(m => m).length)
    // const m = channel.members.map(m => [`${m.user.username}`, m.roles.cache.map(r => r).length])
    // const t = m
    //   .sort((a, b) => (a[1] > b[1] ? -1 : 1))
    //   .map(m => `${m[0]}: ${m[1]}`)
    //   .join('\n')
    // channel.send(t)
  }

  console.log(`Logged in as ${Client.user?.username}!`)
}
