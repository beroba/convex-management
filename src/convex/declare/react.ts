import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoN} from 'alphabet-to-number'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE} from '../../util/type'

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

  const msg = await fetchMessage(react, alpha)

  // 既に済が付いている場合は通知しない
  const sumi = msg.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
  if (sumi) return

  await msg.react(Settings.EMOJI_ID.SUMI)

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
