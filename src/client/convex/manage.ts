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
export const Update = async (arg: string, msg: Discord.Message): Promise<boolean> => {
  // idと凸状況を取得
  const [id, convex] = util.Format(arg).split(' ')

  // 凸状況の書式がおかしい場合は終了
  if (convexFormatConfirm(convex)) {
    msg.reply('凸状況の書式が違うわ')
    return false
  }

  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => v)
  const row = status.GetMemberRow(members, id || '')

  // ユーザーidが存在しない場合は終了
  if (row === 2) {
    msg.reply('クランメンバーにそのidの人は居なかったわよ')
    return false
  }

  return true
}

/**
 * 凸状況の書式が正しいか判別
 * @param convex 凸状況
 * @return 真偽値
 */
const convexFormatConfirm = (convex: string): boolean => {
  // 未凸の場合は持ち越しが発生しないので、長さが1の場合のみtrue
  if (convex[0] === '0') return convex.length === 1 ? true : false

  // 1-3以外の凸数は存在しないのでfalse
  if (/^[1-3]/.test(convex[0])) return false

  return true
}
