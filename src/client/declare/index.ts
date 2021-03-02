import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import {Current} from '../../io/type'
import * as list from '../plan/list'

/**
 * 凸宣言のボスを変更する
 * @param state 現在の状態
 */
export const Change = async (state: Option<Current>) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸予定、凸宣言のメッセージを取得
  const plan = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.PLAN)
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await list.CreatePlanText(state?.alpha || '', state?.stage || '', plans)

  plan.edit(text)
  declare.edit('凸宣言\n```\n \n```')
}

// const setDeclarE = () => {}
