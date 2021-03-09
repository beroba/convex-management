import * as cron from 'node-cron'
import Settings from 'const-settings'
import * as util from '../util'
import * as dateTable from '../io/dateTable'
import * as status from '../io/status'
import * as activityTime from '../client/convex/activityTime'
import * as attendance from '../client/convex/attendance'

// prettier-ignore
/**
 * クーロンで操作する関数一覧
 */
export const CronOperation = () => {
  setRemainConvex('0 10 5 * * *')    // 05:10
  removeTaskillRoll('0 0 5 * * *')   // 05:00
  resetConvex('0 0 5 * * *')         // 05:00
  notifyDailyMission('0 30 4 * * *') // 04:30
  switchAwayInRole()
}

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与するクーロンする
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
 * 全員のタスキルロールを外すクーロンを作成
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
 * メンバー全員の凸状況をリセットするクーロンを作成
 * @param expression クーロン式
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

// prettier-ignore
/**
 * 離席中ロールを切り替えるクーロンの一覧
 */
const switchAwayInRole = () => {
  switchRole('0 0 5 * * *',  1) // 05:00
  switchRole('0 0 8 * * *',  2) // 08:00
  switchRole('0 0 12 * * *', 3) // 12:00
  switchRole('0 0 14 * * *', 4) // 14:00
  switchRole('0 0 18 * * *', 5) // 18:00
  switchRole('0 0 22 * * *', 6) // 22:00
  switchRole('0 0 2 * * *',  7) // 02:00
}

/**
 * 離席中ロールの切り替えをするクーロンを作成する
 * @param expression クーロン式
 * @param section 確認する区分
 */
const switchRole = (expression: string, section: number) => {
  cron.schedule(expression, async () => {
    // クラバトの日じゃない場合は終了
    const date = await dateTable.TakeDate()
    if (date.num === '練習日') return

    // 離席中ロールを切り替える
    await activityTime.Switch(Number(date.num[0]), section)
    await util.Sleep(100)

    // 出欠のメッセージを更新する
    await attendance.Edit()

    console.log(`Switch Away In Role: ${date.num} ${date.day}`)
  })
}
