import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'

export const Toggle = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 前半、後半のメッセージ以外は終了
  if (![Settings.TIME_LIMIT_EMOJI.FIRST, Settings.TIME_LIMIT_EMOJI.LATTER].some(id => id === react.message.id)) return

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ、リアクションを外して終了
  if (!member) {
    react.users.remove(user)
    return
  }

  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 前半と後半のメッセージを取得
  const first = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  const latter = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)

  // メッセージに付いているリアクションをキャッシュ
  await Promise.all(first.reactions.cache.map(async r => await r.users.fetch()))
  await Promise.all(latter.reactions.cache.map(async r => await r.users.fetch()))

  await Promise.all(
    first.reactions.cache
      .map(r => r)
      .filter(r => r.emoji.id !== react.emoji.id)
      .map(async r => await r.users.remove(user))
  )
  await Promise.all(
    latter.reactions.cache
      .map(r => r)
      .filter(r => r.emoji.id !== react.emoji.id)
      .map(async r => await r.users.remove(user))
  )

  console.log(react.emoji.name)

  return 'Setting the activity limit time'
}
