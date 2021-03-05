import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as declaration from './declaration'

/**
 * リアクションを追加した際に凸宣言を更新する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConvexAdd = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ終了
  if (!member) {
    // リアクションを外す
    react.users.remove(user)
    return
  }

  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸宣言を設定する
  await declaration.SetUser(state)

  return 'Addition of convex declaration'
}

/**
 * リアクションを削除した際に凸宣言を更新する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConvexRemove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸宣言を設定する
  await declaration.SetUser(state)

  return 'Addition of convex declaration'
}
