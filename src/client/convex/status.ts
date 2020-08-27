import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as lapAndBoss from './lapAndBoss'
import * as situation from './situation'
import * as date from './date'
import Option from 'type-of-option'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバーのセル一覧から凸報告者の行を取得
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const row = getMemberRow(cells, msg.member)

  // 凸数、持ち越し、3凸終了、前回履歴のセルを取得
  const num_cell = await getCell(0, row, sheet)
  const over_cell = await getCell(1, row, sheet)
  const end_cell = await getCell(2, row, sheet)
  // const hist_cell = await getCell(3, row, sheet)

  // 既に3凸している人は終了する
  if (await end_cell.getValue()) return msg.reply('もう3凸してるわ、お疲れ様')

  // 凸数と持ち越しの状態を更新する
  await statusUpdate(num_cell, over_cell, msg)

  // 凸報告に❌のスタンプをつける
  await msg.react('❌')

  const end = await isThreeConvex(num_cell, over_cell)

  // 3凸終了者の処理を実行
  if (msg.content.charAt(0) === '3') await threeConvexEnd(msg)

  // 現在の周回数とボスを凸報告に送信
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_REPORT)
  channel.send(await lapAndBoss.CurrentMessage())

  // 凸状況を報告
  await situation.Report()
}

/**
 * メンバー一覧から指定したメンバーの行を取得
 * @param cells メンバー一覧のcell
 * @param member 取得したいメンバー
 */
const getMemberRow = (cells: string[], member: Option<Discord.GuildMember>): number =>
  cells.indexOf(util.GetUserName(member)) + 3

/**
 * 指定した列と行のセルを取得する。
 * 列は右にどれだけずらすかを指定する
 * @param n 基準の列から右にずらす数
 * @param row 凸報告の行
 * @param sheet 凸報告のシート
 */
const getCell = async (n = 0, row: number, sheet: any): Promise<any> => {
  const col = await date.GetColumn(n)
  return sheet.getCell(`${col}${row}`)
}

/**
 * 凸数と持ち越しの状態を変更する
 * @param num_cell 凸数のセル
 * @param over_cell 持ち越しのセル
 * @param msg DiscordからのMessage
 */
const statusUpdate = async (num_cell: any, over_cell: any, msg: Discord.Message) => {
  // セルの値を取得
  const num = Number(await num_cell.getValue())
  const over = await over_cell.getValue()

  // ボスを倒した場合はtrue、倒していない場合はfalse
  if (/^kill/.test(msg.content)) {
    // 次のボスに進める
    await lapAndBoss.Next()

    // 持ち越しフラグが立っていたらTrue
    if (over) {
      // 凸数を増やす
      await num_cell.setValue(num + 1)
      // 持ち越しフラグを折る
      await over_cell.setValue()
    } else {
      // 持ち越しフラグを立てる
      await over_cell.setValue(1)
    }
  } else {
    // 凸数を増やす
    await num_cell.setValue(num + 1)

    // 持ち越しがあったら消去する
    if (over) {
      await over_cell.setValue()
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
  const num = await num_cell.getValue()
  if (num !== '3') return false

  // 持ち越し状態があればfalse
  const over = await over_cell.getValue()
  if (over) return false

  // 3凸目で持ち越しがなければ3凸終了者なのでtrue
  return true
}

/**
 * 3凸終了した際に凸残ロールを削除し何人目の3凸終了者か報告をする
 * @param msg DiscordからのMessage
 */
const threeConvexEnd = async (msg: Discord.Message) => {
  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 変更するセルの場所
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const col = await date.GetColumn(2)
  const row = getMemberRow(cells, msg.member)

  // 敵を倒した場合の処理
  if (msg.content !== '3') {
    const c = await date.GetColumn(1)
    const over = await manageSheet.getCell(`${c}${row}`)
    // 持ち越しが発生していたら終了
    if (await over.getValue()) return
  }

  // 凸終了の目印をつける
  const cell = await manageSheet.getCell(`${col}${row}`)
  await cell.setValue(1)

  // 凸残ロールを削除する
  await msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何番目の終了者なのかを報告
  const n = (await manageSheet.getCell(`${col}1`)).getValue()
  msg.reply(`${n}人目の3凸終了者よ！`)

  // 全凸終了していない場合は終了
  if (Number(n) !== cells.filter(v => v).length) return

  await allConvexReport()

  console.log('Complete convex end report')
}

/**
 * 全凸終了報告を行う
 */
const allConvexReport = async () => {
  const day = await date.GetDay()
  const state = await lapAndBoss.GetCurrent()

  // 進行に報告をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(
    `${day}日目の全凸終了報告よ！\n` +
      `今日は\`${state.lap}\`周目の\`${state.boss}\`まで進んだわ\n` +
      `お疲れ様！次も頑張りなさい`
  )
}
