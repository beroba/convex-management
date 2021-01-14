import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
// import * as members from '../io/members'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('きゃるきゃるーん')

  /*
  console.log(1)
  {
    const member = await members.FetchMember('420084355105423367')
    if (!member) return

    member.convex = '3'
    member.over = ''
    member.end = '1'
    member.history = ''

    await members.UpdateMember(member)
  }
  // {
  //   const member = await members.FetchMember('420084355105423367')
  //   if (!member) return
  //   console.log(member)
  //   await members.ReflectOnSheet(member)
  // }
  console.log(2)
  /**/

  // const c = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  // c.send('メンバーの状態 `member`')
  // const t = `\`\`\`json
  // [
  //   {"name": "", "id": "", "convex": "", "over": "", "leave": ""},
  // ]
  // \`\`\``
  // c.send(t)

  // const msg = await c.messages.fetch('796419466404691979')
  // msg.edit('現在の状況 `current`')

  console.log(`Logged in as ${Client.user?.username}!`)
}
