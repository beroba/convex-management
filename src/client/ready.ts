import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as react from './convex/react'
// import * as lapAndBoss from './convex/lapAndBoss'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  // 起動通知を送る
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  // const msg = await channel.send('名前の変更をしたわ')
  // msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname('14歳キャルちゃん')

  console.log(`Logged in as ${Client.user?.username}!`)
}
