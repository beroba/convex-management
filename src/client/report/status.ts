import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as date from '../convex/date'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as report from '../convex/report'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const members: string[] = (await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)).filter(v => v)
  const row = GetMemberRow(members, msg.member)

  // 凸数、持ち越し、3凸終了のセルを取得
  const days = await date.CheckCalnBattle()
  const num_cell = await GetCell(0, row, sheet, days)
  const over_cell = await GetCell(1, row, sheet, days)
  const end_cell = await GetCell(2, row, sheet, days)
  const hist_cell = await GetCell(3, row, sheet, days)

  // 既に3凸している人は終了する
  if (end_cell.getValue()) return msg.reply('もう3凸してるわ')

  // 現在の凸状況を履歴に残しておく
  saveHistory(num_cell, over_cell, hist_cell)

  // 凸数と持ち越しの状態を更新する
  const content = moji(msg.content).convert('ZE', 'HE').toString()
  statusUpdate(num_cell, over_cell, content)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // 3凸終了者の場合は凸終了の処理、していない場合は現在の凸状況を報告
  const end = await isThreeConvex(num_cell, over_cell)
  if (end) {
    convexEndProcess(end_cell, members, sheet, days, msg)
  } else {
    situationReport(num_cell, over_cell, msg)
  }
}

/**
 * メンバー一覧から指定したメンバーの行を取得
 * @param cells メンバー一覧のcell
 * @param member 取得したいメンバー
 * @return 取得した行番号
 */
export const GetMemberRow = (cells: string[], member: Option<Discord.GuildMember>): number =>
  cells.indexOf(util.GetUserName(member)) + 3

/**
 * 指定した列と行のセルを取得する。
 * 列は右にどれだけずらすかを指定する
 * @param n 基準の列から右にずらす数、値がない場合は`0`
 * @param row 凸報告の行
 * @param sheet 凸報告のシート
 * @param days クラバトの日付情報
 * @return 取得したセル
 */
export const GetCell = async (n = 0, row: number, sheet: any, days: string[]): Promise<any> => {
  const col = date.GetColumn(n, days)
  return sheet.getCell(`${col}${row}`)
}

/**
 * 現在の凸状況を履歴に残す
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param hist_cell 履歴のセル
 */
const saveHistory = async (num_cell: any, over_cell: any, hist_cell: any) => {
  const num = num_cell.getValue()
  const over = over_cell.getValue()

  hist_cell.setValue(`${num}${over ? `,${over}` : ''}`)
}

/**
 * 凸数と持ち越しの状態を変更する
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param content 凸報告の内容
 */
const statusUpdate = (num_cell: any, over_cell: any, content: string) => {
  // セルの値を取得
  const num = Number(num_cell.getValue())
  const over = over_cell.getValue()

  // ボスを倒した場合はtrue、倒していない場合はfalse
  if (/^k/i.test(content)) {
    // 次のボスに進める
    lapAndBoss.Next()

    // 持ち越しフラグが立っていたらtrue
    if (over) {
      // 持ち越しフラグを折る
      over_cell.setValue()
    } else {
      // 凸数を増やす
      num_cell.setValue(num + 1)
      // 持ち越しフラグを立てる
      over_cell.setValue(1)
    }
  } else {
    // 持ち越しフラグが立っていたらtrue
    if (over) {
      // 持ち越しフラグを折る
      over_cell.setValue()
    } else {
      // 凸数を増やす
      num_cell.setValue(num + 1)
    }
  }
}

/**
 * 3凸終了しているかの真偽値を返す。
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param end_cell 3凸終了のセル
 * @return 3凸しているかの真偽値
 */
const isThreeConvex = async (num_cell: any, over_cell: any): Promise<boolean> => {
  // 3凸目じゃなければfalse
  const num = num_cell.getValue()
  if (num !== '3') return false

  // 持ち越し状態があればfalse
  const over = over_cell.getValue()
  if (over) return false

  // 3凸目で持ち越しがなければ3凸終了者なのでtrue
  return true
}

/**
 * 3凸終了の扱いにし、凸残ロールを削除し、何人目の3凸終了者か報告をする。
 * 全凸終了時だったら全凸終了報告もする
 * @param end_cell 3凸終了のセル
 * @param members クランメンバー一覧
 * @param sheet 凸報告のシート
 * @param days クラバトの日付情報
 * @param msg DiscordからのMessage
 */
const convexEndProcess = async (end_cell: any, members: string[], sheet: any, days: string[], msg: Discord.Message) => {
  // 3凸終了のフラグを立てる
  await end_cell.setValue(1)

  // 凸残ロールを削除する
  await msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const people_cell = await GetCell(2, 1, sheet, days)
  const n = people_cell.getValue()
  await msg.reply(`3凸目 終了\n\`${n}\`人目の3凸終了よ！`)

  // 全凸終了していたら報告をする
  if (Number(n) === members.length) await report.AllConvex()
}

/**
 * 凸報告者の凸状況を報告する
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param msg DiscordからのMessage
 */
const situationReport = async (num_cell: any, over_cell: any, msg: Discord.Message) => {
  // セルの値を取得
  const num = Number(num_cell.getValue())
  const over = over_cell.getValue()

  await msg.reply(`${num}凸目 ${over ? '持ち越し' : '終了'}`)
}
