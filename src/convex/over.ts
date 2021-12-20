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
export const React = async (msg: Discord.Message): Promise<Option<string>> => {
  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CARRYOVER_SITUATION
  if (!isChannel) return

  msg.react(Settings.EMOJI_ID.KANRYOU)
  sendHistory(msg)

  return 'React Kanryou'
}

/**
 * 持越状況が更新された際に履歴を追加する
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const Edit = async (msg: Discord.Message): Promise<Option<string>> => {
  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CARRYOVER_SITUATION
  if (!isChannel) return

  sendHistory(msg)

  return 'Edit history'
}

/**
 * 凸状況の履歴を追加する
 * @param msg DiscordからのMessage
 */
const sendHistory = async (msg: Discord.Message) => {
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION_HISTORY)
  await history.send(util.HistoryLine())
  // prettier-ignore
  const text = [
    `\`${util.GetUserName(msg.member)}\``,
    msg.content,
  ].join('\n')
  await history.send(text)
}

/**
 * 渡されたメンバーidの持越状況のメッセージを全て取得
 * @param id 取得したいメンバーのid
 */
export const GetAllUserMsg = async (id: string[]): Promise<Discord.Message[]> => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  const msgs = (await channel.messages.fetch()).map(m => m)
  return msgs.filter(m => id.find(n => n === m.author.id)).filter(Boolean)
}

/**
 * 渡されたメンバーidの持越状況を全て削除する
 * @param id 削除したいメンバーのid
 */
export const DeleteAllUserMsg = async (msgs: Discord.Message[]) => {
  for (const m of msgs) {
    await util.Sleep(100)
    m.delete()
  }

  console.log('Delete carryover message')
}

/**
 * 持越状況を全て削除する
 */
export const DeleteAllMsg = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  const msgs = (await channel.messages.fetch()).map(m => m).filter(Boolean)
  for (const m of msgs) {
    await util.Sleep(100)
    m.delete()
  }

  console.log('Delete carryover message')
}
