import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as cron from '../util/cron'
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

  cron.morningActivitySurvey()

  console.log(`Logged in as ${Client.user?.username}!`)
}
