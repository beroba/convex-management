import * as cron from 'node-cron'
import Settings from 'const-settings'
import * as util from '../util'
import * as dateTable from '../io/dateTable'
import * as status from '../io/status'
import * as time from '../client/convex/time'
import * as over from '../client/convex/over'
import * as situation from '../client/convex/situation'
import * as plan from '../client/plan/delete'

/**
 * クーロンで操作する関数一覧
 */
export const CronOperation = () => {
  // 05:10
  cron.schedule('0 10 5 * * *', () => setRemainConvex())
  // 04:50
  cron.schedule('0 50 4 * * *', () => resetAllConvex())
  // 05:00
  cron.schedule('0 0 5 * * *', () => removeTaskillRoll())
  // 05:00
  cron.schedule('0 0 5 * * *', () => resetConvex())
  // 04:30
  cron.schedule('0 30 4 * * *', () => notifyDailyMission())
  // 12:00
  cron.schedule('0 0 12 * * *', () => morningActivitySurvey())
  // 1時間起き
  cron.schedule('0 0 */1 * * *', () => limitTimeDisplay())
}

/**
 * クラバトがある日に、クランメンバー全員に凸残ロールを付与する
 */
const setRemainConvex = async () => {
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
}

/**
 * 凸予定を全て削除する
 */
const resetAllConvex = () => {
  // 凸予定を全て削除
  plan.DeleteAll()

  // 持越を全て削除
  over.AllDeleteMsg()

  // 凸残ロールを全て削除
  // べろばあのクランメンバー一覧を取得
  const clanMembers = util
    .GetGuild()
    ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => m)

  // クランメンバーに凸残ロールを付与する
  clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))
}

/**
 * 全員のタスキルロールを外す
 */
const removeTaskillRoll = () => {
  // 全員のメンバー一覧を取得
  const guildMembers = util.GetGuild()?.members.cache.map(m => m)

  // メンバー全員のタスキルロールを外す
  guildMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.TASK_KILL))

  // bot-notifyに通知をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員のタスキルロールを外したわ')

  console.log('remove task kill role')
}

/**
 * メンバー全員の凸状況をリセットする
 */
const resetConvex = async () => {
  // 全員の凸状況をリセット
  await status.ResetConvex()

  // メンバー全員の状態を取得
  const members = await status.Fetch()
  situation.Report(members)

  // bot-notifyに通知をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員の凸状況をリセットしたわ')

  console.log('Reset convex')
}

/**
 * デイリーミッション消化の通知する
 */
const notifyDailyMission = () => {
  // 雑談に通知をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)
  channel.send('もう4:30よ！デイリーミッションは消化したわよね！！してなかったらぶっ殺すわよ！！！！')

  console.log('Notify daily mission digestion')
}

/**
 * 朝活アンケートを通知する
 */
const morningActivitySurvey = async () => {
  const d = new Date()
  const nextDay = `${d.getMonth() + 1}/${d.getDate() + 1}`

  const date = await dateTable.Fetch()
  const isDay = date.find(d => d.day === nextDay)
  if (!isDay) return

  const text = [
    `<@&${Settings.ROLE_ID.CLAN_MEMBERS}>`,
    `\`${isDay.day}\` クラバト${isDay.num}の朝活アンケートです`,
    `朝活に参加する予定の方は、${Settings.EMOJI_FULL_ID.SANKA} を押して下さい`,
  ].join('\n')

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CLAN_BATTLE_CONTACT)
  const msg = await channel.send(text)
  await msg.react(Settings.EMOJI_ID.SANKA)

  console.log('Notify daily mission digestion')
}

/**
 * 活動限界時間を1時間起きに更新する
 */
const limitTimeDisplay = async () => {
  const members = await status.Fetch()

  // 活動限界時間の表示を更新
  time.Display(members)

  // 現在の時刻を取得
  const date = new Date().getHours().to_s()

  // bot-notifyに通知をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send(`${date}時の活動限界時間を更新したわ`)

  console.log('Periodic update of activity time limit display')
}
