// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as etc from '../convex/etc'
import * as util from '../util'
import * as damageList from '../io/damageList'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  const list = {a: [], b: [], c: [], d: [], e: []}
  await damageList.Update(list)
  const l = await damageList.Fetch()
  console.log(l)

  // リアクションのキャッシュを取る
  etc.Fetch()

  console.log(`Logged in as ${Client.user?.username}!`)

  // {
  //   const channel = util.GetTextChannel('848599008690962462')

  //   const 凸 = new Discord.MessageButton().setCustomId('boss-a').setStyle('DANGER').setLabel('凸')
  //   const 持越 = new Discord.MessageButton().setCustomId('boss-a+').setStyle('SUCCESS').setLabel('持越')
  //   const 取消 = new Discord.MessageButton().setCustomId('boss-a*').setStyle('SECONDARY').setLabel('取消')

  //   const 通したい = new Discord.MessageButton().setCustomId('damage-a').setStyle('SECONDARY').setLabel('⭕')
  //   const 通したくない = new Discord.MessageButton().setCustomId('damage-a+').setStyle('SECONDARY').setLabel('🆖')

  //   const m1 = await channel.send('凸予定')
  //   const m2 = await channel.send({
  //     content: '凸宣言 `⭐持越` `[残凸数(+は持越), 活動限界時間]`',
  //     components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越).addComponents(取消)],
  //   })
  //   const m3 = await channel.send({
  //     content: 'ダメージ集計 `⭕通したい` `🆖事故・通したくない` `✅報告済`',
  //     components: [new Discord.MessageActionRow().addComponents(通したい).addComponents(通したくない)],
  //   })

  //   console.log('――――A――――')
  //   console.log(m1.id)
  //   console.log(m2.id)
  //   console.log(m3.id)
  // }
}
