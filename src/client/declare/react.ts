import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
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

  // 本戦と保険以外の絵文字の場合は終了
  if (![Settings.EMOJI_ID.HONSEN, Settings.EMOJI_ID.HOKEN].some(id => id === react.emoji.id)) return

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

  // 本戦と保険以外の絵文字の場合は終了
  if (![Settings.EMOJI_ID.HONSEN, Settings.EMOJI_ID.HOKEN].some(id => id === react.emoji.id)) return

  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸宣言を設定する
  await declaration.SetUser(state)

  return 'Deletion of convex declaration'
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param user リアクションを外すユーザー
 */
export const ConvexDone = async (user: Discord.User) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 凸宣言に付いているリアクションをキャッシュする
  await Promise.all(declare.reactions.cache.map(async r => await r.users.fetch()))

  // ユーザーのリアクションを全て外す
  await Promise.all(declare.reactions.cache.map(async r => await r.users.remove(user)))

  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸宣言を設定する
  await declaration.SetUser(state)

  console.log('Completion of convex declaration')
}

/**
 * #進行-連携に開放通知を行う
 * @param users メンションを行うユーザー一覧
 */
export const ReleaseNotice = (users: Discord.User[]) => {
  // 重複を省いたメンション一覧を作成する
  const mentions = users
    .filter((n, i, e) => e.indexOf(n) == i)
    .map(u => `<@!${u.id}>`)
    .join(' ')

  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`${mentions} ボスが討伐されたから通して大丈夫よ！`)

  console.log('Release notice')
}
