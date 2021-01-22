import * as cron from 'node-cron'
import Settings from 'const-settings'
import * as util from '../util'
import * as dateTable from '../io/dateTable'
import * as status from '../io/status'

// prettier-ignore
/**
 * クーロンで操作する関数一覧
 */
export const CronOperation = () => {
  setRemainConvex('0 10 5 * * *')    // 05:10
  removeTaskillRoll('0 0 5 * * *')   // 05:00
  resetConvex('0 0 5 * * *')         // 05:00
  notifyDailyMission('0 30 4 * * *') // 04:30
}

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与するクーロンする
 * @param クーロン式
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
 * 全員のタスキルロールを外すクーロンを作成
 * @param クーロン式
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
 * メンバー全員の凸状況をリセットするクーロンを作成
 * @param クーロン式
 */
const resetConvex = (expression: string) => {
  cron.schedule(expression, async () => {
    // 全員の凸状況をリセット
    await status.ResetConvex()
    await status.ResetConvexOnSheet()

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    channel.send('全員の凸状況をリセットしたわ')

    console.log('Reset convex')
  })
}

/**
 デイリーミッション消化の通知するクーロンを作成する
 * @param クーロン式
 */
const notifyDailyMission = (expression: string) => {
  cron.schedule(expression, () => {
    // 雑談に通知をする
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)
    channel.send('もう4:30よ！デイリーミッションは消化したわよね！！してなかったらぶっ殺すわよ！！！！')

    console.log('Notify daily mission digestion')
  })
}
