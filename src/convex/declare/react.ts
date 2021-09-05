import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoN} from 'alphabet-to-number'
import * as list from './list'
import * as situation from '../situation'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Member} from '../../util/type'

/**
 * リアクションを追加した際に凸宣言を更新する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConvexAdd = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const alpha = 'abcde'
    .split('')
    .find(key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id) as Option<AtoE>
  if (!alpha) return

  if (react.message.id !== Settings.DECLARE_MESSAGE_ID[alpha].DECLARE) return

  if (![Settings.EMOJI_ID.TOTU, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) {
    react.users.remove(user)
    return
  }

  const member = await status.FetchMember(user.id)
  if (!member) {
    react.users.remove(user)
    return
  }

  if (Settings.EMOJI_ID.MOCHIKOSHI === react.emoji.id) {
    if (!member.over) {
      react.users.remove(user)
      return
    }
    member.carry = true
  } else {
    member.carry = false
  }

  let members: Member[]
  const declare = member.declare

  member.declare = alpha
  members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel, members)

  situation.Report(members)

  // 既に凸宣言している場合は前の凸宣言を消す
  if (declare) {
    const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[member.declare])
    const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[member.declare].DECLARE)

    await Promise.all(msg.reactions.cache.map(async r => r.users.fetch()))

    // 他の凸宣言を削除
    msg.reactions.cache.map(r => {
      // 同じ凸宣言を押した際、押した絵文字消さないようにする
      if (alpha === member.declare) {
        if (r.emoji.id === react.emoji.id) return
      }
      r.users.remove(user)
    })
  }

  // 離席中ロールを削除
  react.message.guild?.members.cache
    .map(m => m)
    .find(m => m.id === user.id)
    ?.roles.remove(Settings.ROLE_ID.ATTENDANCE)

  return 'Addition of convex declaration'
}

/**
 * リアクションを削除した際に凸宣言を更新する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConvexRemove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  const isMsg = react.message.id === Settings.DECLARE_MESSAGE_ID[alpha].DECLARE
  if (!isMsg) return

  // 凸と持越以外の絵文字の場合は終了
  if (![Settings.EMOJI_ID.TOTU, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) {
    react.users.remove(user)
    return
  }

  const member = await status.FetchMember(user.id)
  if (!member) {
    react.users.remove(user)
    return
  }

  // 凸宣言状態を変更
  member.declare = ''
  // 持越凸状態を解除
  member.carry = false
  const members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel, members)

  situation.Report(members)

  return 'Deletion of convex declaration'
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param member メンバーの状態
 * @param user リアクションを外すユーザー
 */
export const ConvexDone = async (alpha: AtoE, user: Discord.User) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)

  msg.reactions.cache.map(r => r.users.remove(user))

  list.SetUser(alpha, channel)

  // 凸宣言完了者のメッセージを全て削除
  ;(await channel.messages.fetch())
    .map(m => m)
    .filter(m => m.author.id === user.id)
    .map(m => m.delete())

  console.log('Completion of convex declaration')
}

/**
 * リアクションを押すことで確認通知を行う
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const ConfirmNotice = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.TOOSHI
  if (!isEmoji) {
    // 持越と待機の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.MOCHIKOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return
    react.users.remove(user)
    return
  }

  const msg = await fetchMessage(react, alpha)

  // 既に済が付いている場合は通知しない
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
  if (sumi) return

  await msg.react(Settings.EMOJI_ID.SUMI)
  // prettier-ignore
  const text = [
    '確定！',
    `id: ${msg.member?.id}`,
  ].join('\n')
  await msg.reply(text)

  return 'Confirm notice'
}

/**
 * リアクションを押すことで持越通知を行う
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const OverNotice = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.MOCHIKOSHI
  if (!isEmoji) {
    // 通しと待機の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.TAIKI].some(id => id === react.emoji.id)) return
    react.users.remove(user)
    return
  }

  const msg = await fetchMessage(react, alpha)

  // 既に済が付いている場合は通知しない
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
  if (sumi) return

  // prettier-ignore
  const text = [
    '持越！',
    `id: ${msg.member?.id}`,
  ].join('\n')
  await msg.reply(text)

  return 'Carry over notice'
}

/**
 * リアクションを押すことで待機マークを付ける
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const StayMark = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  // 凸宣言の持越にはリアクションは終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.TAIKI
  if (!isEmoji) {
    // 通しと持越の絵文字は外さずに終了
    if ([Settings.EMOJI_ID.TOOSHI, Settings.EMOJI_ID.MOCHIKOSHI].some(id => id === react.emoji.id)) return
    react.users.remove(user)
    return
  }

  const msg = await fetchMessage(react, alpha)

  // 既に済が付いている場合は通知しない
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
  if (sumi) return

  await msg.react(Settings.EMOJI_ID.SUMI)

  return 'Carry over notice'
}

/**
 * リアクションを外した際に済も外す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const NoticeCancel = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  // 凸宣言の持越にリアクションした場合は終了
  if (Settings.DECLARE_MESSAGE_ID[alpha].DECLARE === react.message.id) return

  const msg = await fetchMessage(react, alpha)
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
  sumi?.remove()
}

/**
 * 凸宣言している人全員へ開放通知を行う
 * @param alpha ボス番号
 * @param msg DiscordからのMessage
 */
export const OpenNotice = async (alpha: AtoE): Promise<Option<string>> => {
  const members = await status.Fetch()

  const declares = members.filter(m => m.declare === alpha)
  if (!declares.length) return

  const mentions = declares.map(m => `<@!${m.id}>`).join(' ')

  return `${mentions} ${AtoN(alpha)}ボス 開放！`
}

/**
 * リアクションからメッセージを取得する
 * @param react 取得元のリアクション
 * @return 取得したメッセージ
 */
const fetchMessage = async (react: Discord.MessageReaction, alpha: AtoE): Promise<Discord.Message> => {
  const msg = react.message
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  await channel.messages.fetch(msg.id)
  return msg as Discord.Message
}
