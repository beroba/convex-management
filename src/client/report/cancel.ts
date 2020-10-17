import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as spreadsheet from '../../util/spreadsheet'
import * as util from '../../util'
import * as convex from '../convex'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as situation from '../convex/situation'

/**
 * 凸報告を取り消す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const Cancel = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸報告でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.TORIKESHI) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_REPORT)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // クランメンバーじゃなければ終了
  const isRole = react.message.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) return

  // 凸状況を元に戻す
  const result = await statusRestore(react.message, user)
  // 失敗したら終了
  if (!result) return

  // 凸状況に報告
  situation.Report()

  return 'Convex cancellation'
}

/**
 * 凸報告を取り消す
 * @param msg DiscordからのMessage
 * @return 取り消し処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // クランメンバーじゃなければ終了
  const isRole = msg.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) return

  // 凸状況を元に戻す
  const user = msg.member?.user
  if (!user) return

  const result = await statusRestore(msg, user)
  // 失敗したら終了
  if (!result) return

  // 凸状況に報告
  situation.Report()

  return 'Convex cancellation'
}

/**
 * 凸状況を元に戻す
 * @param msg DiscordからのMessage
 * @param user リアクションしたユーザー
 * @return 成功したかの真偽値
 */
const statusRestore = async (msg: Discord.Message, user: Discord.User): Promise<boolean> => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => v)
  const member = util.GetMembersFromUser(msg.guild?.members, user)
  const row = convex.GetMemberRow(members, user.id)

  // 凸数、持ち越し、3凸終了、前回履歴のセルを取得
  const days = await convex.GetDay()
  const num_cell = await convex.GetCell(0, days[2], row, sheet)
  const over_cell = await convex.GetCell(1, days[2], row, sheet)
  const end_cell = await convex.GetCell(2, days[2], row, sheet)
  const hist_cell = await convex.GetCell(3, days[2], row, sheet)

  // 2回キャンセルしてないか確認
  const result = checkCancelTwice(num_cell, over_cell, hist_cell)
  // キャンセルしていた場合は終了
  if (result) return false

  // 凸状況を1つ前に戻す
  rollback(num_cell, over_cell, hist_cell)
  // 3凸時の処理
  endConfirm(end_cell, member)
  // 凸状況を報告
  feedback(num_cell, over_cell, user)
  // ボス倒していたかを判別
  killConfirm(msg)

  return true
}

/**
 * 2回キャンセルしてないか確認
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param hist_cell 履歴のセル
 * @return キャンセルしていたかの真偽値
 */
const checkCancelTwice = (num_cell: any, over_cell: any, hist_cell: any): boolean => {
  const num = num_cell.getValue()
  const over = over_cell.getValue()
  const hist = hist_cell.getValue()
  return num + over === hist.replace(',', '')
}

/**
 * 凸状況を1つ前に戻す
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param hist_cell 履歴のセル
 */
const rollback = (num_cell: any, over_cell: any, hist_cell: any) => {
  // セルの値を取得
  const hist = hist_cell.getValue().split(',')

  // 履歴を戻す
  num_cell.setValue(hist[0])
  over_cell.setValue(hist[1])
}

/**
 * 3凸目の取消の場合に凸残ロールを付与する
 * @param end_cell 3凸終了のセル
 * @param member 取消者のメンバー情報
 */
const endConfirm = (end_cell: any, member: Option<Discord.GuildMember>) => {
  // 3凸目でないなら終了
  const end = end_cell.getValue()
  if (!end) return

  // 3凸終了のフラグを折る
  end_cell.setValue()

  // 凸残ロールを付与する
  member?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)
}

/**
 * 凸報告に凸状況を報告
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param user 取消者のユーザー情報
 */
const feedback = (num_cell: any, over_cell: any, user: Discord.User) => {
  // セルの値を取得
  const num = Number(num_cell.getValue())
  const over = over_cell.getValue()

  // 凸報告に凸状況を報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_REPORT)
  channel.send(`取消を行ったわよ\n<@!${user.id}>, ` + (num ? `${num}凸目 ${over ? '持ち越し' : '終了'}` : '未凸'))
}

/**
 * ボスを倒していた場合、前のボスに戻す
 * @param msg DiscordからのMessage
 */
const killConfirm = async (msg: Discord.Message) => {
  const content = util.Format(msg.content)
  // ボスを倒していなければ終了
  if (!/^k|kill/i.test(content)) return

  // 前のボスに戻す
  lapAndBoss.Previous()
}
