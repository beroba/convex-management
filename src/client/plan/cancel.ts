import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as list from './list'

/**
 * 凸予定の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Already = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸予定でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.KANRYOU) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // クランメンバーじゃなければ終了
  const isRole = react.message.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 凸予定の完了を付ける
  await convexComplete(sheet, cells, react.message)

  // メッセージを削除
  react.message.delete()
  msgCalDelete(cells, react.message)

  // ボスのロールを外す
  deleteBossRole(cells, react.message)

  // 凸状況を更新
  list.SituationEdit()

  return 'Delete completed message'
}

/**
 * 凸予定のメッセージを削除した際に完了処理を実行
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 凸予定が完了しているか確認
  if (!isConvexPlan(cells, msg)) return

  // 凸予定の完了を付ける
  await convexComplete(sheet, cells, msg)

  // メッセージを削除
  msgCalDelete(cells, msg)

  // ボスのロールを外す
  deleteBossRole(cells, msg)

  // 凸状況を更新
  list.SituationEdit()

  return 'Delete completed message'
}

/**
 * 凸予定が完了していなければture、でなければfalse
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 * @return 結果の真偽値
 */
const isConvexPlan = (cells: string[], msg: Discord.Message): boolean => {
  // 凸予定に削除したメッセージのidがあるか確認
  const list = PiecesEach(cells, 8)
    .map(c => c.slice(0, 3))
    .filter(c => c.some(v => v === msg.id))

  // なければfalse
  if (list.length === 0) return false
  // 凸予定が完了してたらfalse
  if (list[0][0] === '1') return false
  // 凸予定があって完了してなければtrue
  return true
}

/**
 * キャルのメッセージを削除する
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 */
const msgCalDelete = async (cells: string[], msg: Discord.Message) => {
  const id = PiecesEach(cells, 8).filter(v => v[1] === msg.id)[0][2]
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  // メッセージを削除する
  ;(await channel.messages.fetch(id)).delete()
}

/**
 * 凸予定の完了をする
 * @param sheet 凸予定のシート
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 */
const convexComplete = async (sheet: any, cells: string[], msg: Discord.Message) => {
  // 行を取得
  const row =
    PiecesEach(cells, 8)
      .map(v => v[1])
      .indexOf(msg.id) + 3

  // 値の更新
  const cell = await sheet.getCell(`A${row}`)
  cell.setValue('1')
}

/**
 * 削除されたメッセージのボスのロールを外す
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 */
const deleteBossRole = (cells: string[], msg: Discord.Message) => {
  // メッセージのボス番号を取得
  const num = PiecesEach(cells, 8).filter(v => v[1] === msg.id)[0][5]

  // ボス番号のロールを付与
  msg.member?.roles.remove(Settings.BOSS_ROLE_ID[num])
}
