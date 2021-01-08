import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
// import * as current from '../io/current'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  /*
  ;(async () => {
    const c = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
    const t = `\`\`\`json
{
  "stage": "",
  "lap": "",
  "boss": "",
  "num": "",
  "alpha": "",
  "hp": ""
}
\`\`\``
    // c.send(t)

    const msg = await c.messages.fetch('796419468045582437')
    msg.edit(t)
  })()
  /**/

  console.log(`Logged in as ${Client.user?.username}!`)
}
