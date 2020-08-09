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
  const [laps, BOSSNum] = arg.replace('　', ' ').split(' ')
  if (!/\d/.test(laps)) return msg.reply('形式が違うわ、やりなおし！')
  if (!/[a-e]|[A-E]/.test(BOSSNum)) return msg.reply('形式が違うわ、やりなおし！')

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // ボスの名前を取得
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  const BOSS: string = util.PiecesEach(cells, 2).filter(v => v[0] === BOSSNum.toLowerCase())[0][1]

  // 現在の周回数とボスを更新
  const [laps_cell, BOSS_cell] = Settings.INFORMATION_SHEET.CURRENT_CELLS.split(':')
  await (await infoSheet.getCell(laps_cell)).setValue(laps)
  await (await infoSheet.getCell(BOSS_cell)).setValue(BOSS)

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
  const [laps, BOSS] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.CURRENT_CELLS)

  return `現在の状況は\`${laps}\`周目の\`${BOSS}\`よ`
}
