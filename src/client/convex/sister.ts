import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 持ち越し凸先の自分のメッセージに絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Delete = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持ち越し凸先でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CARRYOVER_DESTINATION) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_DESTINATION)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // メッセージを削除する
  react.message.delete()

  return "Delete my sister's completed message"
}

/**
 * 持ち越し凸先のメッセージにルナの絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const React = (msg: Discord.Message): Option<string> => {
  // #持ち越し状況でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CARRYOVER_SITUATION) return

  // ルナの絵文字をつける
  msg.react(Settings.EMOJI_ID.RUNA)

  return 'React Kanryou'
}
