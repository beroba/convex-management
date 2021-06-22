import * as cron from 'node-cron'
import Settings from 'const-settings'
import * as util from '../util'
import * as dateTable from '../io/dateTable'
import * as status from '../io/status'
import * as limitTime from '../client/convex/limitTime'
import * as situation from '../client/convex/situation'
import * as plan from '../client/plan/delete'

// prettier-ignore
/**
 * クーロンで操作する関数一覧
 */
export const CronOperation = () => {
  setRemainConvex('0 10 5 * * *')    // 05:10
  resetAllPlan('0 50 4 * * *')    // 04:50
  removeTaskillRoll('0 0 5 * * *')   // 05:00
  resetConvex('0 0 5 * * *')         // 05:00
  notifyDailyMission('0 30 4 * * *') // 04:30
  limitTimeDisplay('0 1 */1 * * *')  // 1時間起き
}

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与するクーロンを作成する
 * @param expression クーロン式
 */
const setRemainConvex = (expression: string) => {
  cron.schedule(expression, async () => {
    // クラバトの日じゃない場合は終了
    const date = await dateTable.TakeDate()
    if (date.num === '練習日') return

    // べろばあのクランメンバー一覧を取得
    const clanMembers = util
      .GetGuild()
      ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
      ?.members.map(m => m)

    // クランメンバーに凸残ロールを付与する
    clanMembers?.forEach(m => m?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX))

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send('クランメンバーに凸残ロールを付与したわ')

    console.log('Add convex role')
  })
}

/**
 * 凸予定を全て削除するクーロンを作成する
 * @param expression クーロン式
 */
const resetAllPlan = (expression: string) => {
  cron.schedule(expression, () => {
    // 凸予定を全て削除
    plan.DeleteAll()
  })
}

/**
 * 全員のタスキルロールを外すクーロンを作成する
 * @param expression クーロン式
 */
const removeTaskillRoll = (expression: string) => {
  cron.schedule(expression, () => {
    // 全員のメンバー一覧を取得
    const guildMembers = util.GetGuild()?.members.cache.map(m => m)

    // メンバー全員のタスキルロールを外す
    guildMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.TASK_KILL))

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send('全員のタスキルロールを外したわ')

    console.log('remove task kill role')
  })
}

/**
 * メンバー全員の凸状況をリセットするクーロンを作成する
 * @param expression クーロン式
 */
const resetConvex = (expression: string) => {
  cron.schedule(expression, async () => {
    // 全員の凸状況をリセット
    await status.ResetConvex()
    await status.ResetConvexOnSheet()

    // メンバー全員の状態を取得
    const members = await status.Fetch()
    situation.Report(members)

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send('全員の凸状況をリセットしたわ')

    console.log('Reset convex')
  })
}

/**
 * デイリーミッション消化の通知するクーロンを作成する
 * @param expression クーロン式
 */
const notifyDailyMission = (expression: string) => {
  cron.schedule(expression, () => {
    // 雑談に通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)
    channel.send('もう4:30よ！デイリーミッションは消化したわよね！！してなかったらぶっ殺すわよ！！！！')

    console.log('Notify daily mission digestion')
  })
}

/**
 * 活動限界時間を1時間起きに更新するクーロンを作成する
 * @param expression クーロン式
 */
const limitTimeDisplay = (expression: string) => {
  cron.schedule(expression, async () => {
    const members = await status.Fetch()

    // 活動限界時間の表示を更新
    limitTime.Display(members)

    // 現在の時刻を取得
    const date = String(new Date().getHours())

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send(`${date}時の活動限界時間を更新したわ`)

    console.log('Periodic update of activity time limit display')
  })
}
