import * as Discord from 'discord.js'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as status from '../report/status'

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param arg プレイヤーidと凸状況
 * @param msg DiscordからのMessage
 */
export const Update = async (arg: string, msg: Discord.Message) => {
  // idと凸状況を取得
  const [id, convex] = util.Format(arg).split(' ')

  // 凸状況の書式がおかしい場合は終了
  if (!/^[0-3]/.test(convex[0])) return

  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => v)
  const row = status.GetMemberRow(members, id || '')

  // ユーザーidが存在しない場合は終了
  if (row === 2) return

  msg
  convex
}
