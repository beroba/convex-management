import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import {Current} from '../../io/type'
import * as list from '../plan/list'
import * as declaration from './declaration'
import * as status from './status'

/**
 * 凸宣言のボスを変更する
 * @param state 現在の状態
 */
export const ChangeBoss = async (state: Option<Current>) => {
  if (!state) return

  // ボスの状態を更新
  status.Update(state)

  // 凸予定一覧を更新
  SetPlanList(state)

  // 凸宣言のリアクションを全て外す
  await declaration.ResetReact()

  // 凸宣言をリセット
  declaration.SetUser(state)

  // メッセージを削除
  messageDelete()
}

/**
 * 凸予定一覧を更新する
 * @param state 現在の状況
 */
export const SetPlanList = async (state: Current) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸予定のメッセージを取得
  const plan = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.PLAN)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await list.CreatePlanText(state.alpha, state.stage, plans)

  // 凸予定一覧を更新
  // 1行目を取り除く
  plan.edit('凸予定\n' + text.split('\n').slice(1).join('\n'))
}

/**
 * 凸宣言-ボス状況のメッセージを削除する
 */
const messageDelete = async () => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // キャル以外のメッセージを全てを削除
  const list = await Promise.all(
    (await channel.messages.fetch())
      .map(m => m)
      .filter(m => !m.author.bot)
      .map(async m => {
        // 凸宣言に付いているリアクションをキャッシュする
        await Promise.all(m.reactions.cache.map(async r => await r.users.fetch()))

        // メッセージを削除
        return m.delete()
      })
  )

  // 済が付いていないメッセージのユーザー一覧のリストを作成
  const users = list
    .filter(m => !m.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI))
    .map(m => m.author)

  // 削除したメッセージがない場合は終了
  if (!users.length) return

  // 開放通知を行う
  releaseNotice(users)
}

/**
 * #進行-連携に開放通知を行う
 * @param users メンションを行うユーザー一覧
 */
const releaseNotice = (users: Discord.User[]) => {
  // 重複を省いたメンション一覧を作成する
  const mentions = users
    .filter((n, i, e) => e.indexOf(n) == i)
    .map(u => `<@!${u.id}>`)
    .join(' ')

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`${mentions} ボスが討伐されたから通して大丈夫よ！`)

  console.log('Release notice')
}
