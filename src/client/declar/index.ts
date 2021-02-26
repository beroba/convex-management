import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import {Current} from '../../io/type'
import * as list from '../plan/list'

export const Change = async (state: Option<Current>) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLAR)

  const plan = await channel.messages.fetch(Settings.CONVEX_DECLAR_ID.PLAN)
  const declar = await channel.messages.fetch(Settings.CONVEX_DECLAR_ID.DECLAR)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await list.CreatePlanText(state?.alpha || '', state?.stage || '', plans)

  plan.edit(text)
  declar.edit('凸宣言\n```\n \n```')
}
