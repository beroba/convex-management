import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as list from './list'

/**
 * 凸予定のメッセージ更新に合わせてスプレッドシートの値も更新する
 * @param msg DiscordからのMessage
 * @return 更新処理の実行結果
 */
export const Message = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 凸予定の更新
  const result = await planUpdate(sheet, cells, msg)
  if (!result) return

  // 凸状況を更新
  list.SituationEdit()

  return 'Edit appointment message'
}

/**
 * 凸予定のメッセージを更新をする
 * @param sheet 凸予定のシート
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 * @return 実行結果の真偽値
 */
const planUpdate = async (sheet: any, cells: string[], msg: Discord.Message): Promise<Boolean> => {
  // 行を取得
  const row =
    PiecesEach(cells, 8)
      .map(v => v[1])
      .indexOf(msg.id) + 3

  // idが存在しなければ終了
  if (row === 2) return false

  // ボス番号を除いたメッセージを取得
  const content = util.Format(msg.content).slice(1).trim()

  // 値の更新
  const cell = await sheet.getCell(`H${row}`)
  cell.setValue(content)
  return true
}
