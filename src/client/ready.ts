import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = () => {
  const channel = util.GetTextChannel(Settings.STARTUP.CHANNEL_ID)
  channel.send(Settings.STARTUP.MESSAGE)

  console.log(`Logged in as ${Client.user?.username}!`)
}
