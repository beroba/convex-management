import * as cron from 'node-cron'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import {Client} from '../index'
import * as util from '../util'
import * as spreadsheet from '../util/spreadsheet'
import * as date from '../client/convex/date'
import * as lapAndBoss from '../client/convex/lapAndBoss'

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
  // 最終日以外
  cron.schedule('0 10 5 * * *', async () => {
    // クラバトの日じゃない場合、またはクラバト最終日の場合は終了
    const day = await date.GetDay()
    if (!day || day === '5') return

    // 全凸している場合は終了
    if (await convexConfirm()) return

    // #進行に報告をする
    await convexSituationReport()

    console.log('Convex situation report')
  })

  // 最終日
  cron.schedule('0 10 0 * * *', async () => {
    // クラバトの日じゃない場合、またはクラバト最終日じゃない場合は終了
    const day = await date.GetDay()
    if (!day || day !== '5') return

    // 全凸している場合は終了
    if (await convexConfirm()) return

    // #進行に報告をする
    await convexSituationReport()

    console.log('Convex situation report')
  })
}

/**
 * 全凸してるか確認し真偽値を返す
 * @return 真偽値
 */
const convexConfirm = async (): Promise<boolean> => {
  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // クランメンバー一覧を取得
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)

  // 現在の3凸数を取得
  const col = await date.GetColumn(2)
  const n = (await manageSheet.getCell(`${col}1`)).getValue()

  // 比較結果を返す
  return Number(n) === cells.filter(v => v).length
}

/**
 * 全凸終了報告を行う
 */
const convexSituationReport = async () => {
  // 全凸終了処理を行う
  const day = await date.GetDay()
  const state = await lapAndBoss.GetCurrent()

  // 凸残したユーザー一覧を取得
  const guild = Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))
  const 凸残 = guild?.roles.cache.get(Settings.ROLE_ID.REMAIN_CONVEX)?.members.map(m => `<@!${m.user.id}>`)

  // 進行に報告をする
  const channel = util.GetTextChannel(Settings.CONVEX_CHANNEL.PROGRESS_ID)
  channel.send(
    `${day}日目の凸状況報告よ！\n` +
      `今日の凸残りは ${凸残?.join(' ')} よ\n` +
      `\`${state.lap}\`周目の\`${state.boss}\`まで進んだわ\n` +
      `お疲れ様！次も頑張りなさい`
  )
}
