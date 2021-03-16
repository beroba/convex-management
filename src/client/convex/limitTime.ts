import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'

/**
 * 活動限界時間を設定する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @returns 活動限界時間設定の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
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

  // 活動限界時間の更新
  Update(user.id)

  return 'Setting the activity limit time'
}

/**
 * 活動限界時間を設定する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @returns 活動限界時間設定の実行結果
 */
export const Remove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 前半、後半のメッセージ以外は終了
  if (![Settings.TIME_LIMIT_EMOJI.FIRST, Settings.TIME_LIMIT_EMOJI.LATTER].some(id => id === react.message.id)) return

  // 活動限界時間の更新
  Update(user.id)

  return 'Setting the activity limit time'
}

export const Display = () => {}

/**
 * 引数で渡したユーザーidの活動限界時間を設定する
 * @param id ユーザーid
 */
export const Update = async (id: string) => {
  // メンバーの状態を取得
  let member = await status.FetchMember(id)
  if (!member) return

  // 活動限界時間の設定
  member.limit = await fetchLimit(id)

  // ステータスを更新
  await status.UpdateMember(member)
  await util.Sleep(100)

  // 活動限界時間をスプレッドシートに反映
  status.ReflectOnSheet(member)
}

/**
 * 活動限界時間をリアクションから取得する
 * @param id ユーザーid
 * @returns 取得した時間
 */
const fetchLimit = async (id: string): Promise<string> => {
  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 前半と後半のメッセージを取得
  const first = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  const latter = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)

  // 前半の時間を取得
  const f = await Promise.all(
    first.reactions.cache
      .map(r => r)
      .filter(r => r.users.cache.map(u => u.id).some(u => u === id))
      .map(r => r.emoji.name.replace('_', ''))
  )
  // 後半の時間を取得
  const l = await Promise.all(
    latter.reactions.cache
      .map(r => r)
      .filter(r => r.users.cache.map(u => u.id).some(u => u === id))
      .map(r => r.emoji.name.replace('_', ''))
  )

  // 前半と後半を結合
  const list = f.concat(l)

  // 1番後ろの値を取得、なければ空
  return list[list.length - 1] !== undefined ? list[list.length - 1] : ''
}
