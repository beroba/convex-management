import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as spreadsheet from '../../util/spreadsheet'
import * as util from '../../util'

/**
 * 現在の周回数とボスを変更する
 * @param arg 変更したい周回数とボス番号
 * @param msg DiscordからのMessage
 */
export const Update = async (arg: string, msg: Discord.Message) => {
  // 周回数とボス番号を取得
  const [laps, num] = arg.replace('　', ' ').split(' ')

  // 書式が違う場合は終了
  if (!/\d/.test(laps)) return msg.reply('形式が違うわ、やりなおし！')
  if (!/[a-e]|[A-E]/.test(num)) return msg.reply('形式が違うわ、やりなおし！')

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const boss = await getBossName(infoSheet, num)

  // 現在の周回数とボスを更新
  const [laps_cell, boss_cell, num_cell] = await getCurrentCell(infoSheet)
  await spreadsheet.SetValue(laps_cell, laps)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 現在の周回数とボスを返信
  msg.reply(await CurrentMessage())
}

/**
 * 現在の周回数とボスをメッセージで返す
 * @param msg DiscordからのMessage
 * @return 現在の周回数とボスのメッセージ
 */
export const CurrentMessage = async (): Promise<string> => {
  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 範囲を指定して現在の周回数とボスを取得
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [laps, boss] = await spreadsheet.GetCells(infoSheet, `${range[0]}:${range[1]}`)

  return `現在、\`${laps}\`周目の\`${boss}\`よ`
}

/**
 * 現在の周回数とボスを次に進める
 */
export const Next = async () => {
  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  const [laps_cell, boss_cell, num_cell] = await getCurrentCell(infoSheet)

  const laps = await spreadsheet.GetValue(laps_cell)
  const num = await spreadsheet.GetValue(num_cell)

  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 4 ? 0 : n + 1))(numberList.indexOf(num))
  const num_ = numberList[n]
  const laps_: number = n ? laps : Number(laps) + 1

  const boss_ = await getBossName(infoSheet, num_)

  await spreadsheet.SetValue(laps_cell, laps_)
  await spreadsheet.SetValue(boss_cell, boss_)
  await spreadsheet.SetValue(num_cell, num_)
}

/**
 * 情報シートから現在のボスの名前を取得する
 * @param infoSheet 情報のシート
 * @param num ボスの番号
 * @return ボスの名前
 */
const getBossName = async (infoSheet: any, num: string): Promise<string> => {
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  return util.PiecesEach(cells, 2).filter(v => v[0] === num.toLowerCase())[0][1]
}

/**
 * 情報シートの現在の周回数とボスのセルを取得する
 * @param infoSheet 情報のシート
 * @return セルの一覧
 */
const getCurrentCell = (infoSheet: any): any[] =>
  Settings.INFORMATION_SHEET.CURRENT_CELL.split(',').map((cell: string) => infoSheet.getCell(cell))
