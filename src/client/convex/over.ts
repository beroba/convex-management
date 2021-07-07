import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 持越状況の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Delete = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持越状況でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CARRYOVER_SITUATION) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.KANRYOU) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // メッセージを削除する
  react.message.delete()

  return 'Delete completed message'
}

/**
 * 持越状況のメッセージに完了の絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const React = (msg: Discord.Message): Option<string> => {
  // #持越状況でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CARRYOVER_SITUATION) return

  // 完了の絵文字をつける
  msg.react(Settings.EMOJI_ID.KANRYOU)

  return 'React Kanryou'
}

/**
 * メンバーの持越状況を全て削除する
 * @param member 削除したいメンバーの情報
 */
export const AllDelete = async (member: Option<Discord.GuildMember>) => {
  // 持越状況を全て削除
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  ;(await channel.messages.fetch())
    .map(m => m)
    .filter(m => m.author.id === member?.id)
    .forEach(m => m.delete())

  console.log('Delete carryover message')
}
