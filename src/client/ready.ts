import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
// import * as io from '../util/io'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  /*
  ;(async () => {
    const c = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
    //     const t = `\`\`\`json
    // [
    //   {"days": "", "date": "", "col": ""},
    //   {"days": "", "date": "", "col": ""},
    //   {"days": "", "date": "", "col": ""},
    //   {"days": "", "date": "", "col": ""},
    //   {"days": "", "date": "", "col": ""},
    //   {"days": "", "date": "", "col": ""}
    // ]
    // \`\`\``
    //     c.send(t)

    const msg = await c.messages.fetch('796393409119780874')
    msg.edit('ボステーブル `dateTable`')
  })()
  /**/

  console.log(`Logged in as ${Client.user?.username}!`)
}
