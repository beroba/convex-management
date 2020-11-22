import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as convex from '../convex'
import * as spreadsheet from '../../util/spreadsheet'
import * as util from '../../util'

/**
 * 持ち越し状況の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Delete = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持ち越し状況でなければ終了
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
 * 持ち越し状況のメッセージに完了の絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const React = (msg: Discord.Message): Option<string> => {
  // #持ち越し状況でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CARRYOVER_SITUATION) return

  // 完了の絵文字をつける
  msg.react(Settings.EMOJI_ID.KANRYOU)

  return 'React Kanryou'
}

/**
 * メッセージ送信者の持ち越し状況を全て削除する
 * @param msg DiscordからのMessage
 */
export const AllDelete = async (msg: Discord.Message) => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => v)
  const row = convex.GetMemberRow(members, msg.member?.id || '')

  // 持ち越し状況か確認
  const days = await convex.GetDays()
  const over_cell = await convex.GetCell(1, days.col, row, sheet)
  const over = await over_cell.getValue()

  // 持ち越し状況でない場合は終了
  if (!over) return

  // 持ち越し状況を全て削除
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_SITUATION)
  ;(await channel.messages.fetch())
    .map(v => v)
    .filter(m => m.author.id === msg.author.id)
    .forEach(m => m.delete())

  console.log('Delete carryover message')
}
