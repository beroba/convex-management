import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
// import * as schedule from '../io/schedule'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  // schedule.ReflectOnCal()

  // await schedule.Delete('796373319699791873')
  // await util.Sleep(50)

  // const plan = {
  //   done: '',
  //   senderID: '796373319699791874',
  //   calID: '796373321809526795',
  //   name: 'smicle(スマイル)',
  //   playerID: '420084355105423367',
  //   num: '2',
  //   alpha: 'b',
  //   boss: 'ランドスロース',
  //   msg: '1800',
  // }
  // await schedule.Add(plan)

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
