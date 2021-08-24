import * as cron from 'node-cron'
import * as etc from '../client/convex/etc'
import * as role from '../client/convex/role'
import * as time from '../client/convex/time/time'

/**
 * クーロン処理一覧
 */
export const CronOperation = () => {
  // 05:10
  cron.schedule('0 10 5 * * *', () => role.SetRemainConvex())
  // 04:50
  cron.schedule('0 50 4 * * *', () => role.ResetAllConvex())
  // 05:00
  cron.schedule('0 0 5 * * *', () => role.RemoveTaskillRole())
  // 05:00
  cron.schedule('0 0 5 * * *', () => etc.ResetConvex())
  // 04:30
  cron.schedule('0 30 4 * * *', () => etc.NotifyDailyMission())
  // 12:00
  cron.schedule('0 0 12 * * *', () => time.MorningActivitySurvey())
  // 1時間起き
  cron.schedule('0 0 */1 * * *', () => time.LimitTimeDisplay())
}
