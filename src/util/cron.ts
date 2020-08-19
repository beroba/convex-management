import * as cron from 'node-cron'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as date from '../client/convex/date'

/**
 * クーロンで操作する関数一覧
 */
export const CronOperation = () => {
  setRemainConvex()
  fullConvexReport()
}

/**
 * クラバトがある日の朝5時に、クランメンバー全員に凸残ロールを付与する。
 * '0 0 5 * * *'
 */
const setRemainConvex = () => {
  // 朝5時に実行
  cron.schedule('0 0 5 * * *', async () => {
    // クラバトの日じゃない場合は終了
    const day = await date.GetDay()
    if (!day) return

    // べろばあのクランメンバー一覧を取得
    const guild = Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))
    const clanMembers = guild?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)?.members.map(m => m)

    // クランメンバーに凸残ロールを付与する
    clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.STARTUP.CHANNEL_ID)
    channel.send('クランメンバーに凸残ロールを付与したわ')

    console.log('Add convex roll')
  })
}

/**
 * 全凸されていない場合にその日付の凸状況を報告をする
 */
const fullConvexReport = () => {
  cron.schedule('0 10 5 * * *', async () => {})
}
