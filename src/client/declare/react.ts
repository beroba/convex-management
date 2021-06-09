import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'
import {AtoE} from '../../io/type'
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

  // チャンネルのボス番号を取得
  const alpha = 'abcde'
    .split('')
    .find(key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言のメッセージでなければ終了
  if (react.message.id !== Settings.DECLARE_MESSAGE_ID[alpha].DECLARE) return

  // 凸と持越以外の絵文字の場合は終了
  if (![Settings.EMOJI_ID.TOTU, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) {
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

  // 持越のリアクションが押された際の処理
  if (Settings.EMOJI_ID.MOCHIKOSHI === react.emoji.id) {
    // 持ち越しがなければ終了
    if (!member.over) {
      // リアクションを外す
      react.users.remove(user)
      return
    }

    // 持越凸状態に変更
    member.carry = true
  } else {
    // 持越凸状態を解除
    member.carry = false
  }

  // 既に凸宣言している場合は前の凸宣言を消す
  if (member.declare) {
    // 凸宣言のチャンネルを取得
    const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[member.declare])

    // 凸宣言のメッセージを取得
    const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[member.declare].DECLARE)

    // 凸宣言のリアクションをキャッシュ
    await Promise.all(msg.reactions.cache.map(async r => r.users.fetch()))

    // 他の凸宣言を削除
    await Promise.all(
      msg.reactions.cache.map(async r => {
        // 同じ凸宣言を押した際、押した絵文字消さないようにする
        if (alpha === member.declare) {
          if (r.emoji.id === react.emoji.id) return
        }
        await r.users.remove(user)
      })
    )

    // 他の凸宣言を削除する分遅らせる
    await util.Sleep(500)

    // 凸宣言状態を変更
    member.declare = alpha
    await status.UpdateMember(member)
  } else {
    // 他の凸宣言がない場合はSleepしない

    // 凸宣言状態を変更
    member.declare = alpha
    await status.UpdateMember(member)
  }

  // 凸宣言を設定
  await declaration.SetUser(alpha)

  // 離席中ロールを削除
  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.remove(Settings.ROLE_ID.AWAY_IN)

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

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言のメッセージでなければ終了
  if (react.message.id !== Settings.DECLARE_MESSAGE_ID[alpha].DECLARE) return

  // 凸と持越以外の絵文字の場合は終了
  if (![Settings.EMOJI_ID.TOTU, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) {
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

  // 凸宣言状態を変更
  member.declare = ''
  // 持越凸状態を解除
  member.carry = false
  await status.UpdateMember(member)

  // 凸宣言を設定
  await declaration.SetUser(alpha)

  return 'Deletion of convex declaration'
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param member メンバーの状態
 * @param user リアクションを外すユーザー
 */
export const ConvexDone = async (alpha: AtoE, user: Discord.User) => {
  // 凸宣言のチャンネルを取得
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)

  // ユーザーのリアクションを全て外す
  await Promise.all(msg.reactions.cache.map(async r => await r.users.remove(user)))

  // 凸宣言を設定
  await declaration.SetUser(alpha, channel)

  // prettier-ignore
  // 凸宣言完了者のメッセージを全て削除
  await Promise.all(
    (await channel.messages.fetch())
      .map(m => m)
      .filter(m => m.author.id === user.id)
      .map(async m => await m.delete())
  )

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

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  // 通し以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TOOSHI) {
    // 持越と待機の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.MOCHIKOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得
  const msg = await fetchMessage(react, alpha)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content} 確定！`)

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

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  // 持越以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.MOCHIKOSHI) {
    // 通しと待機の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得
  const msg = await fetchMessage(react, alpha)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content} 持ち越し！`)

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

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  // 待機以外の絵文字の場合は終了
  if (react.emoji.id !== Settings.EMOJI_ID.TAIKI) {
    // 通しと持越の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) return

    // 関係のないリアクションを外す
    react.users.remove(user)
    return
  }

  // リアクションからメッセージを取得
  const msg = await fetchMessage(react, alpha)

  // 済の絵文字を取得
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)

  // 既に済が付いている場合は通知しない
  if (sumi) return

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`<@!${msg.author.id}> ${msg.content} 待機！`)

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

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  // 確認と持越と待機以外の絵文字の場合は終了
  if (
    ![Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.MOCHIKOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)
  )
    return

  // リアクションからメッセージを取得
  const msg = await fetchMessage(react, alpha)

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
const fetchMessage = async (react: Discord.MessageReaction, alpha: AtoE): Promise<Discord.Message> => {
  const msg = react.message

  // 凸宣言のチャンネルを取得
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // キャッシュとして読み込む
  await channel.messages.fetch(msg.id)

  return msg
}
