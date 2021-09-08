// import * as Discord from 'discord.js'
import Settings from 'const-settings'
import {Client} from '../index'
import * as react from '../convex/react'
import * as util from '../util'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  react.Fetch()

  /*
  {
    const channel = util.GetTextChannel('848599008690962462')
    const 凸 = new Discord.MessageButton().setCustomId('boss-a').setStyle('DANGER').setLabel('凸')
    const 持越 = new Discord.MessageButton().setCustomId('boss-a+').setStyle('SUCCESS').setLabel('持越')
    const m1 = await channel.send('ボス状況')
    const m2 = await channel.send('凸予定')
    const m3 = await channel.send({
      content: '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
      components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越)],
    })
    console.log('――――A――――')
    console.log(m1.id)
    console.log(m2.id)
    console.log(m3.id)
  }
  {
    const channel = util.GetTextChannel('848599096163041301')
    const 凸 = new Discord.MessageButton().setCustomId('boss-b').setStyle('DANGER').setLabel('凸')
    const 持越 = new Discord.MessageButton().setCustomId('boss-b+').setStyle('SUCCESS').setLabel('持越')
    const m1 = await channel.send('ボス状況')
    const m2 = await channel.send('凸予定')
    const m3 = await channel.send({
      content: '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
      components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越)],
    })
    console.log('――――B――――')
    console.log(m1.id)
    console.log(m2.id)
    console.log(m3.id)
  }
  {
    const channel = util.GetTextChannel('848599115305582632')
    const 凸 = new Discord.MessageButton().setCustomId('boss-c').setStyle('DANGER').setLabel('凸')
    const 持越 = new Discord.MessageButton().setCustomId('boss-c+').setStyle('SUCCESS').setLabel('持越')
    const m1 = await channel.send('ボス状況')
    const m2 = await channel.send('凸予定')
    const m3 = await channel.send({
      content: '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
      components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越)],
    })
    console.log('――――C――――')
    console.log(m1.id)
    console.log(m2.id)
    console.log(m3.id)
  }
  {
    const channel = util.GetTextChannel('848599134637654026')
    const 凸 = new Discord.MessageButton().setCustomId('boss-d').setStyle('DANGER').setLabel('凸')
    const 持越 = new Discord.MessageButton().setCustomId('boss-d+').setStyle('SUCCESS').setLabel('持越')
    const m1 = await channel.send('ボス状況')
    const m2 = await channel.send('凸予定')
    const m3 = await channel.send({
      content: '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
      components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越)],
    })
    console.log('――――D――――')
    console.log(m1.id)
    console.log(m2.id)
    console.log(m3.id)
  }
  {
    const channel = util.GetTextChannel('848599154875301898')
    const 凸 = new Discord.MessageButton().setCustomId('boss-e').setStyle('DANGER').setLabel('凸')
    const 持越 = new Discord.MessageButton().setCustomId('boss-e+').setStyle('SUCCESS').setLabel('持越')
    const m1 = await channel.send('ボス状況')
    const m2 = await channel.send('凸予定')
    const m3 = await channel.send({
      content: '凸宣言 `[残凸数(+は持越), 活動限界時間]`',
      components: [new Discord.MessageActionRow().addComponents(凸).addComponents(持越)],
    })
    console.log('――――E――――')
    console.log(m1.id)
    console.log(m2.id)
    console.log(m3.id)
  }
  // */

  console.log(`Logged in as ${Client.user?.username}!`)
}
