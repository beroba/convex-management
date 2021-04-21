import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as declaration from './declaration'
import * as declare from './status'

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

  // 凸宣言のメッセージでなければ終了
  if (react.message.id !== Settings.CONVEX_DECLARE_ID.DECLARE) return

  // 凸以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TOTU) {
    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでない場合は終了
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

  // 凸宣言のメッセージでなければ終了
  if (react.message.id !== Settings.CONVEX_DECLARE_ID.DECLARE) return

  // 凸以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TOTU) {
    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

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
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // ユーザーのリアクションを全て外す
  await Promise.all(msg.reactions.cache.map(async r => await r.users.remove(user)))

  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸宣言を設定する
  await declaration.SetUser(state)

  // 凸宣言完了者のメッセージを全て削除
  await Promise.all(
    (await channel.messages.fetch())
      .map(m => m)
      .filter(m => m.author.id === user.id)
      .map(m => m.delete())
  )

  // 現在の状態を更新
  declare.Update(state)

  console.log('Completion of convex declaration')
}

/**
 * リアクションを押すことで確認通知を行う
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConfirmNotice = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 通し以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TOOSHI) {
    // 持越と待機以外の絵文字の場合は終了
    if ([Settings.EMOJI_ID.MOCHIKOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得する
  const msg = await fetchMessage(react)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content}の確定をお願いするわ！`)

  return 'Confirm notice'
}

/**
 * リアクションを押すことで持越通知を行う
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const OverNotice = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 持越以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.MOCHIKOSHI) {
    // 通しと待機以外の絵文字の場合は終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得する
  const msg = await fetchMessage(react)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content}で持ち越しお願いするわ！`)

  return 'Carry over notice'
}

/**
 * リアクションを押すことで持越通知を行う
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const WaitNotice = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 待機以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TAIKI) {
    // 通しと持越以外の絵文字の場合は終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得する
  const msg = await fetchMessage(react)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content}は待機でお願いするわ！`)

  return 'Carry over notice'
}

/**
 * 通しか持越か待機のリアクションを外した際に済も外す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const NoticeCancel = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸宣言-ボス状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 確認と持越と待機以外の絵文字の場合は終了
  if (
    ![Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.MOCHIKOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)
  )
    return

  // リアクションからメッセージを取得
  const msg = await fetchMessage(react)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 済を削除
  sumi?.remove()
}

/**
 * リアクションからメッセージを取得する
 * @param react 取得元のリアクション
 * @return 取得したメッセージ
 */
const fetchMessage = async (react: Discord.MessageReaction): Promise<Discord.Message> => {
  const msg = react.message

  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // キャッシュとして読み込む
  await channel.messages.fetch(msg.id)

  return msg
}
