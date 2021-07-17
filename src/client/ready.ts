import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as react from './convex/react'
import * as queue from '../util/queue'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  queue.Push(ready)
}

/**
 * キャルが起動した際に通知を送る
 */
const ready = async () => {
  // 起動通知を送る
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  console.log(`Logged in as ${Client.user?.username}!`)
}
