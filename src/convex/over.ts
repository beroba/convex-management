import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../util'

/**
 * 持越状況の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Delete = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.CARRYOVER_SITUATION
  if (!isChannel) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.KANRYOU
  if (!isEmoji) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  const msg = <Discord.Message>react.message
  if (msg.author.id !== user.id) return

  react.message.delete()

  return 'Delete completed message'
}

/**
 * 持越状況のメッセージに完了の絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const React = (msg: Discord.Message): Option<string> => {
  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CARRYOVER_SITUATION
  if (!isChannel) return

  msg.react(Settings.EMOJI_ID.KANRYOU)

  return 'React Kanryou'
}

/**
 * メンバーの持越状況を全て削除する
 * @param member 削除したいメンバーの情報
 */
export const DeleteMsg = async (member: Option<Discord.GuildMember>) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  const msgs = await channel.messages.fetch()

  msgs
    .map(m => m)
    .filter(m => m.author.id === member?.id) // 同じメンバーで絞る
    .forEach(m => {
      if (!m) return
      m.delete()
    })

  console.log('Delete carryover message')
}

/**
 * 持越状況を全て削除する
 */
export const AllDeleteMsg = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  const msgs = await channel.messages.fetch()

  msgs
    .map(m => m)
    .forEach(m => {
      if (!m) return
      m.delete()
    })

  console.log('Delete carryover message')
}
