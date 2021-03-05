import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import {Current} from '../../io/type'
import * as list from '../plan/list'
import * as declaration from './declaration'

/**
 * 凸宣言のボスを変更する
 * @param state 現在の状態
 */
export const ChangeBoss = async (state: Option<Current>) => {
  // 凸予定一覧を更新する
  await SetPlanList(state)

  // 凸宣言のリアクションを全て外す
  await declaration.ResetReact()

  // 凸宣言をリセットする
  await declaration.SetUser(state)

  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // キャル以外のメッセージを全てを削除
  ;(await channel.messages.fetch())
    .map(m => m)
    .filter(m => !m.author.bot)
    .forEach(m => m.delete())
}

/**
 * 凸予定一覧を更新する
 * @param state 現在の状況
 */
export const SetPlanList = async (state: Option<Current>) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸予定のメッセージを取得
  const plan = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.PLAN)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await list.CreatePlanText(state?.alpha || '', state?.stage || '', plans)

  // 凸予定一覧を更新
  plan.edit('凸予定 ' + text)
}
