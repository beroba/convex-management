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
    const channel = util.GetTextChannel('881962172673060894')

    channel.send('離席中状態の変更')

    const text = [
      '<@&797189384595832853> は、このメッセージがオレンジ色になります。',
      '↓のボタンで離席中状態を変更できます。',
    ].join('\n')
    const 離席中 = new Discord.MessageButton().setCustomId('riseki-on').setStyle('PRIMARY').setLabel('離席中')
    const 解除 = new Discord.MessageButton().setCustomId('riseki-off').setStyle('SECONDARY').setLabel('解除')
    await channel.send({
      content: text,
      components: [new Discord.MessageActionRow().addComponents(離席中).addComponents(解除)],
    })
  }
  // */

  console.log(`Logged in as ${Client.user?.username}!`)
}
