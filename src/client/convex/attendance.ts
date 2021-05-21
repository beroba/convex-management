import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as schedule from '../../io/schedule'
import * as list from '../plan/list'
import * as declare from '../declare'

/**
 * 出欠のメッセージに出席のリアクションを付けたら離席中ロールを外す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール変更処理の実行結果
 */
export const Remove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 付けたリアクションを外す
  react.users.remove(user)

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ終了
  if (!member) return

  // 出欠のメッセージでない場合は終了
  if (react.message.id !== Settings.ACTIVITY_TIME.AWAY_IN) return

  // 出席リアクションでない場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.SHUSEKI) return

  // 離席中ロールを削除
  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.remove(Settings.ROLE_ID.AWAY_IN)

  await util.Sleep(100)

  // 出欠のメッセージを更新する
  await Edit()

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  list.SituationEdit(plans)

  // 凸宣言の凸予定の表示を更新
  const state = await current.Fetch()
  declare.SetPlanList(state)

  return 'Remove the role away in'
}

/**
 * 出欠のメッセージに離席のリアクションを付けたら離席中ロールを付ける
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール変更処理の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 付けたリアクションを外す
  react.users.remove(user)

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ終了
  if (!member) return

  // 出欠のメッセージでない場合は終了
  if (react.message.id !== Settings.ACTIVITY_TIME.AWAY_IN) return

  // 出席リアクションでない場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.RISEKI) return

  // 離席中ロールを付与
  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.add(Settings.ROLE_ID.AWAY_IN)

  await util.Sleep(100)

  // 出欠のメッセージを更新する
  await Edit()

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  list.SituationEdit(plans)

  // 凸宣言の凸予定の表示を更新
  const state = await current.Fetch()
  declare.SetPlanList(state)

  return 'Remove the role away in'
}

/**
 * 出欠のメッセージを更新する
 */
export const Edit = async () => {
  // 更新するメッセージ
  const text = [
    `<@&${Settings.ROLE_ID.AWAY_IN}> はこのメッセージがオレンジ色になります。`,
    `メッセージに付けたリアクションはすぐに消えます。\n`,
    `> 凸予定が表示されない場合は、${Settings.EMOJI_FULL_ID.SHUSEKI}を押して下さい。`,
    `> 離席する際は、${Settings.EMOJI_FULL_ID.RISEKI}を押して下さい。`,
  ].join('\n')

  // 出欠のメッセージを取得する
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)
  const msg = await channel.messages.fetch(Settings.ACTIVITY_TIME.AWAY_IN)

  // メッセージを更新
  await msg.edit(text)
}
