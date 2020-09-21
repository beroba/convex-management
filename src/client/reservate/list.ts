import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

export const Output = async (arg: string, msg: Discord.Message) => {
  const list = readReservateList()
  list
  const table = await readBossTable()
  const boss = takeBossName(arg, table)
  boss

  arg
  msg
}

export const AllOutput = async (msg: Discord.Message) => {
  const list = readReservateList()
  list

  msg
}

const readReservateList = async (): Promise<string[][]> => {
  const sheet = await spreadsheet.GetWorksheet(Settings.RESERVATE_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.RESERVATE_SHEET.RESERVATE_CELLS)

  return util
    .PiecesEach(cells, 8)
    .filter(v => !/^,+$/.test(v.toString()))
    .filter(v => !v[0])
}

const readBossTable = async (): Promise<string[][]> => {
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  return util.PiecesEach(cells, 2).filter(v => !/^,+$/.test(v.toString()))
}

// prettier-ignore
const takeBossName = (num: string, table: string[][]): string =>
  table.filter(v => v[0] === num.toLowerCase())[0][1]
