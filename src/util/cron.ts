import * as cron from 'node-cron'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import * as util from '../util'
import {Client} from '../index'
import {GetDateColumn} from '../client/convex/report'

/**
 * クラバトがある日の朝5時に、クランメンバー全員に凸残ロールを付与する
 */
export const SetRemainConvex = () => {
  // 朝5時に実行
  cron.schedule('0 0 5 * * *', async () => {
    // べろばあのクランメンバー一覧を取得
    const guild = Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))
    const clanMembers = guild?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)?.members.map(m => m)

    // クラバトの日じゃない場合は終了
    const day = await GetDateColumn()
    if (!day) return

    // クランメンバーに凸残ロールを付与する
    clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

    // bot-notifyに通知をする
    const channel = util.GetTextChannel(Settings.STARTUP.CHANNEL_ID)
    channel.send('クランメンバーに凸残ロールを付与したわ')

    console.log('Add convex roll')
  })
}
