import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as declare from '../declare/list'
import * as list from '../plan/list'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE} from '../../util/type'

/**
 * 出欠のメッセージに出席のリアクションを付けたら離席中ロールを外す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール変更処理の実行結果
 */
export const Remove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.ACTIVITY_TIME
  if (!isChannel) return

  react.users.remove(user)

  const member = await status.FetchMember(user.id)
  if (!member) return

  const isMessage = react.message.id === Settings.ATTENDANCE
  if (!isMessage) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.SHUSEKI
  if (!isEmoji) return

  // 離席中ロールを削除
  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.remove(Settings.ROLE_ID.ATTENDANCE)
  await util.Sleep(100)

  await Edit()

  const plans = await schedule.Fetch()
  await list.SituationEdit(plans)

  await Promise.all(
    // 全ボス分[a-e]
    'abcde'.split('').map(async a => {
      await declare.SetPlan(a as AtoE)
      await declare.SetUser(a as AtoE)
    })
  )

  return 'Remove the role away in'
}

/**
 * 出欠のメッセージに離席のリアクションを付けたら離席中ロールを付ける
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール変更処理の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.ACTIVITY_TIME
  if (!isChannel) return

  react.users.remove(user)

  const member = await status.FetchMember(user.id)
  if (!member) return

  const isMsg = react.message.id === Settings.ATTENDANCE
  if (!isMsg) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.RISEKI
  if (isEmoji) return

  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.add(Settings.ROLE_ID.ATTENDANCE)
  await util.Sleep(100)

  await Edit()

  const plans = await schedule.Fetch()
  list.SituationEdit(plans)

  await Promise.all(
    // 全ボス分[a-e]
    'abcde'.split('').map(async a => {
      await declare.SetPlan(a as AtoE)
      await declare.SetUser(a as AtoE)
    })
  )

  return 'Remove the role away in'
}

/**
 * 出欠のメッセージを更新する
 */
export const Edit = async () => {
  const text = [
    `<@&${Settings.ROLE_ID.ATTENDANCE}> はこのメッセージがオレンジ色になります。`,
    `メッセージに付けたリアクションはすぐに消えます。\n`,
    `> 凸予定が表示されない場合は、${Settings.EMOJI_FULL_ID.SHUSEKI}を押して下さい。`,
    `> 離席する際は、${Settings.EMOJI_FULL_ID.RISEKI}を押して下さい。`,
  ].join('\n')

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)
  const msg = await channel.messages.fetch(Settings.ATTENDANCE)

  await msg.edit(text)
}
