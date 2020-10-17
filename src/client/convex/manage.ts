import * as Discord from 'discord.js'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as date from './date'
import * as status from '../report/status'

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param arg プレイヤーidと凸状況
 * @param msg DiscordからのMessage
 * @return 実行結果の真偽値
 */
export const Update = async (arg: string, msg: Discord.Message): Promise<boolean> => {
  // idと凸状況を取得
  const [id, convex] = util.Format(arg).split(' ')

  // 凸状況の書式がおかしい場合は終了
  if (!convexFormatConfirm(convex)) {
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

  // 変更者のユーザーネームを取得
  const name = members.filter(m => m[1] === id)[0][0]

  // 3凸終了とそれ以外に処理を分ける
  if (convex === '3') {
    // 現在の3凸人数を取得
    const days = await date.GetDay()
    const people_cell = await date.GetCell(2, 1, sheet, days)
    convexEndProcess(await readCells(row, sheet), people_cell, name)
  } else {
    updateProcess(await readCells(row, sheet), convex, name)
  }

  return true
}

/**
 * 凸状況の書式が正しいか判別
 * @param convex 凸状況
 * @return 真偽値
 */
const convexFormatConfirm = (convex: string): boolean => {
  // 未凸の場合は持ち越しが発生しないので長さが1の場合のみtrue、それ以外はfalse
  if (convex[0] === '0') return convex.length === 1 ? true : false

  // 先頭が1-3はtrue、それ以外はfalse
  return /^[1-3]/.test(convex[0])
}

/**
 * [num_cell, over_cell, end_cell]をまとめた配列を返す
 * @param row 更新者の行
 * @param sheet 凸報告のシート
 * @return cellsの配列
 */
const readCells = async (row: number, sheet: any): Promise<any[]> => {
  const days = await date.GetDay()
  const num_cell = await date.GetCell(0, row, sheet, days)
  const over_cell = await date.GetCell(1, row, sheet, days)
  const end_cell = await date.GetCell(2, row, sheet, days)
  return [num_cell, over_cell, end_cell]
}

/**
 * 3凸状態に更新する処理
 * @param cells [num_cell, over_cell, end_cell]の配列
 * @param msg DiscordからのMessage
 */
const convexEndProcess = async (cells: any[], people_cell: any, name: string) => {
  const [num_cell, over_cell, end_cell] = [...cells]

  // 3凸状態に更新
  num_cell.setValue(3)
  over_cell.setValue('')
  end_cell.setValue('1')

  // 何人目の3凸終了者なのかを報告する
  const n = Number(people_cell.getValue()) + 1
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`${name}, 3凸目 終了\n\`${n}\`人目の3凸終了よ！`)
}

/**
 * 凸状況を更新する処理
 * @param cells [num_cell, over_cell, end_cell]の配列
 * @param convex 凸状況
 * @param msg DiscordからのMessage
 */
const updateProcess = async (cells: any[], convex: string, name: string) => {
  const [num_cell, over_cell, end_cell] = [...cells]

  // 凸状況から凸数と持ち越しに分ける
  const [num, over] =
    convex.length === 1
      ? [convex === '0' ? '' : convex, '']
      : [
          ...convex
            .replace(/ /g, '')
            .split(',')
            .map(n => (n === '0' ? '' : n)),
        ]

  // 凸状況を更新
  num_cell.setValue(num)
  over_cell.setValue(over)
  end_cell.setValue('')

  // 凸状況を報告する
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`${name}, ` + (num ? `${num}凸目 ${over ? '持ち越し' : '終了'}` : '未凸'))
}
