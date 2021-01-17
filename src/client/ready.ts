import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  // const c = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  //   c.send('凸予定の情報 `plan`')
  //   const t = `\`\`\`json
  // [
  // ]
  // \`\`\``
  //   c.send(t)

  // const msg = await c.messages.fetch('799393325106987028')
  // msg.edit('凸予定の情報 `plan`')

  console.log(`Logged in as ${Client.user?.username}!`)
}
