import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as spreadsheet from '../../util/spreadsheet'
import * as util from '../../util'
import * as date from './date'
import * as lapAndBoss from './lapAndBoss'
import * as situation from './situation'
import * as status from './status'

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

  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return

  // 凸状況を元に戻す
  await statusRestore(react, user)

  // 凸状況に報告
  situation.Report()

  return 'Convex cancellation'
}

/**
 * 凸状況を元に戻す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
const statusRestore = async (react: Discord.MessageReaction, user: Discord.User) => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const members: string[] = (await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)).filter(v => v)
  const member = util.GetMembersFromUser(react.message.guild?.members, user)
  const row = status.GetMemberRow(members, member)

  // 凸数、持ち越し、3凸終了、前回履歴のセルを取得
  const days = await date.CheckCalnBattle()
  const num_cell = await status.GetCell(0, row, sheet, days)
  const over_cell = await status.GetCell(1, row, sheet, days)
  const end_cell = await status.GetCell(2, row, sheet, days)
  const hist_cell = await status.GetCell(3, row, sheet, days)

  // 凸状況を1つ前に戻す
  rollback(num_cell, over_cell, hist_cell)
  // 3凸時の処理
  endConfirm(end_cell, member)
  // 凸状況を報告
  feedback(num_cell, over_cell, user)
  // ボス倒していたかを判別
  killConfirm(react)
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
 * @param react DiscordからのReaction
 */
const killConfirm = async (react: Discord.MessageReaction) => {
  // ボスを倒していなければ終了
  if (!/^(k|ｋ)/i.test(react.message.content)) return

  // 前のボスに戻す
  lapAndBoss.Previous()
}
