import * as cron from 'node-cron'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as date from '../client/convex/date'
import * as report from '../client/convex/report'

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
  cron.schedule('0 10 5 * * *', async () => {
    // クラバトの日じゃない場合は終了
    const day = await date.GetDay()
    if (!day) return

    // べろばあのクランメンバー一覧を取得
    const guild = Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))
    const clanMembers = guild?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)?.members.map(m => m)

    // クランメンバーに凸残ロールを付与する
    clanMembers?.forEach(m => m?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX))

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send('クランメンバーに凸残ロールを付与したわ')

    console.log('Add convex role')
  })
}

/**
 * 全凸されていない場合にその日付の凸状況を報告をする
 */
const fullConvexReport = () => {
  /**
   * 全凸してるか確認し真偽値を返す
   * @return 真偽値
   */
  const convexConfirm = (): boolean => {
    // べろばあのクランメンバー一覧を取得
    const guild = Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))

    // 凸残ロールがついている人が居るか確認
    const remain = guild?.roles.cache.get(Settings.ROLE_ID.REMAIN_CONVEX)?.members.map(m => m)
    return remain?.length ? true : false
  }

  // 最終日以外
  cron.schedule('0 5 5 * * *', async () => {
    // クラバトの日じゃない場合、またはクラバト最終日の場合は終了
    const day = await date.GetDay()
    if (!day || day === '1') return

    // 全凸している場合は終了
    if (convexConfirm()) return

    // #進行に報告をする
    await report.Unevenness(Number(day) - 1)

    console.log('Convex situation report')
  })

  // 最終日
  cron.schedule('0 5 0 * * *', async () => {
    // クラバトの日じゃない場合、またはクラバト最終日じゃない場合は終了
    const day = await date.GetDay()
    if (!day || day !== '5') return

    // 全凸している場合は終了
    if (convexConfirm()) return

    // #進行に報告をする
    await report.Unevenness(day)

    console.log('Convex situation report')
  })
}
