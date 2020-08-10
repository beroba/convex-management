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
  if (!/\d/.test(laps)) return msg.reply('形式が違うわ、やりなおし！')
  if (!/[a-e]|[A-E]/.test(num)) return msg.reply('形式が違うわ、やりなおし！')

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // ボスの名前を取得
  const boss = await getBossName(infoSheet, num)

  // 現在の周回数とボスを更新
  const [laps_cell, boss_cell, num_cell] = await getCurrentCell(infoSheet)
  await (await laps_cell).setValue(laps)
  await (await boss_cell).setValue(boss)
  await (await num_cell).setValue(num)

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
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [laps, boss] = await spreadsheet.GetCells(infoSheet, `${range[0]}:${range[2]}`)

  return `現在、\`${laps}\`周目の\`${boss}\`よ`
}

export const Next = async () => {
  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  const [laps_cell, boss_cell, num_cell] = await getCurrentCell(infoSheet)

  const laps = await spreadsheet.GetValue(laps_cell)
  const num = await spreadsheet.GetValue(num_cell)

  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 4 ? 0 : n + 1))(numberList.indexOf(num))
  const num_ = numberList[n]
  const laps_ = n ? laps : Number(laps) + 1

  const boss_ = await getBossName(infoSheet, num_)

  await (await laps_cell).setValue(laps_)
  await (await boss_cell).setValue(boss_)
  await (await num_cell).setValue(num_)
}

const getBossName = async (infoSheet: any, num: string): Promise<string> => {
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  return util.PiecesEach(cells, 2).filter(v => v[0] === num.toLowerCase())[0][1]
}

const getCurrentCell = (infoSheet: any): Promise<any> =>
  Settings.INFORMATION_SHEET.CURRENT_CELL.split(',').map(async (cell: string) => await infoSheet.getCell(cell))
