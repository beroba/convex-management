import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as fetch from '../util/fetch'

/**
 * キャルが起動した際に通知を送る
 */
export const Ready = async () => {
  // // 起動通知を送る
  // const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  // await channel.send('きゃるきゃるーん')

  // リアクションのキャッシュを取る
  fetch.React()

  //   {
  //     const channel = util.GetTextChannel('791537113459589192')
  //     const msg = await channel.messages.fetch('806336380967190588')
  //     msg.edit(`
  // \`\`\`json
  // [
  // ]
  // \`\`\`
  // `)
  //   }

  // チャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 本戦、保険の絵文字を付ける
  await declare.react(Settings.EMOJI_ID.HONSEN)
  await declare.react(Settings.EMOJI_ID.HOKEN)

  // msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname('キャル')

  console.log(`Logged in as ${Client.user?.username}!`)
}
