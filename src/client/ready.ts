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

  // /*
  ;(async () => {
    const c = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
    c.send('日付テーブル `daysTable`')
    // const msg = await c.messages.fetch('793374464422576139')
    // msg.edit('ボステーブル `bossTable`')

    // const bosstable = await io.Fetch<bosstable[]>('793374466402418708')
    // console.log(bosstable)
    // bosstable[0].name = 'ゴブリングレート'
    // await io.Update('793374466402418708', bosstable)
  })()
  /**/

  console.log(`Logged in as ${Client.user?.username}!`)
}
