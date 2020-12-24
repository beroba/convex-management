import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as list from '../plan/list'
import * as category from '../command/category'

/**
 * 現在のボスの情報
 */
type Current = {
  lap: string
  boss: string
  num: string
}

/**
 * 現在の周回数とボスを変更する
 * @param arg 変更したい周回数とボス番号
 * @return Updateしたかの真偽値
 */
export const Update = async (arg: string): Promise<boolean> => {
  // 周回数とボス番号を取得
  const [lap, num] = arg.replace(/　/g, ' ').split(' ')

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return false
  if (!/[a-e]/i.test(num)) return false

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const boss = await readBossName(sheet, num)

  // 現在の周回数とボスを更新
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(sheet)
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // キャルのボスロールを切り替える
  switchBossRole(num)

  // 段階数の区切りを付ける
  stageConfirm()

  return true
}

/**
 * 現在の周回数とボスを次に進める
 */
export const Next = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(sheet)
  const [lap, boss, num] = await readForwardDate(lap_cell, num_cell, sheet)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // キャルのボスロールを切り替える
  switchBossRole(num)

  // 段階数の区切りを付ける
  stageConfirm()
}

/**
 * 現在の周回数とボスを前に戻す
 */
export const Previous = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 設定するセルと値を取得
  const [lap_cell, boss_cell, num_cell] = readCurrentCell(sheet)
  const [lap, boss, num] = await readReturnDate(lap_cell, num_cell, sheet)

  // 現在の周回数とボスを更新
  await spreadsheet.SetValue(lap_cell, lap)
  await spreadsheet.SetValue(boss_cell, boss)
  await spreadsheet.SetValue(num_cell, num)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // キャルのボスロールを切り替える
  switchBossRole(num)

  // 段階数の区切りを付ける
  stageConfirm()
}

/**
 * 現在の周回数とボスをオブジェクトで返す
 * @return 現在の周回数とボス
 */
export const GetCurrent = async (): Promise<Current> => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 範囲を指定して現在の周回数とボスを取得
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [lap, boss] = await spreadsheet.GetCells(sheet, `${range[0]}:${range[1]}`)

  // ボス番号の取得
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  const num = PiecesEach(cells, 2).filter(v => v[1] === boss)[0][0]

  return {lap: lap, boss: boss, num: num}
}

/**
 * #進行に現在の周回数とボスを報告
 */
export const ProgressReport = async () => {
  // 現在の周回数とボスを取得
  const state = await GetCurrent()

  // ボスのロールを取得
  const role = Settings.BOSS_ROLE_ID[state.num]

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${role}>\n\`${state.lap}\`周目 \`${state.boss}\``)
  list.PlanOnly(state.num)
}

/**
 * キャルのボスロールを切り替える
 * @param num ボス番号
 */
const switchBossRole = (num: string) => {
  // キャルのユーザー情報を取得
  const cal = util.GetGuild()?.members.cache.get(Settings.CAL_ID)

  // 全てのボスロールを外す
  Object.values(Settings.BOSS_ROLE_ID as string[]).forEach(id => cal?.roles.remove(id))

  // 現在のボスロールを付ける
  cal?.roles.add(Settings.BOSS_ROLE_ID[num])

  console.log("Switch Cal's boss role")
}

/**
 * 情報シートから現在のボスの名前を取得する
 * @param sheet 情報のシート
 * @param num ボスの番号
 * @return ボスの名前
 */
const readBossName = async (sheet: any, num: string): Promise<string> => {
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)
  return PiecesEach(cells, 2).filter(v => v[0] === num.toLowerCase())[0][1]
}

/**
 * 情報シートの現在の周回数とボスのセルを取得する
 * @param sheet 情報のシート
 * @return セルの一覧
 */
const readCurrentCell = (sheet: any): any[] =>
  Settings.INFORMATION_SHEET.CURRENT_CELL.split(',').map((cell: string) => sheet.getCell(cell))

/**
 * 情報シートの現在の周回数とボスから次に進める値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @param sheet 情報のシート
 * @return 設定する値
 */
const readForwardDate = async (lap_cell: any, num_cell: any, sheet: any): Promise<[number, string, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 4 ? 0 : n + 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const boss = await readBossName(sheet, numberList[n])
  return [n ? lap : Number(lap) + 1, boss, numberList[n]]
}

/**
 * 情報シートの現在の周回数とボスから前に戻す値を取得する
 * @param lap_cell 周回数のセル
 * @param num_cell ボス番号のセル
 * @param sheet 情報のシート
 * @return 設定する値
 */
const readReturnDate = async (lap_cell: any, num_cell: any, sheet: any): Promise<[number, string, string]> => {
  // 現在の周回数とボス番号を取得
  const lap = await spreadsheet.GetValue(lap_cell)
  const num = await spreadsheet.GetValue(num_cell)

  // ボス番号調べる
  const numberList = ['a', 'b', 'c', 'd', 'e']
  const n = (n => (n === 0 ? 4 : n - 1))(numberList.indexOf(num))

  // 周回数とボスとボス番号を返す
  const boss = await readBossName(sheet, numberList[n])
  return [n === 4 ? Number(lap) - 1 : lap, boss, numberList[n]]
}

/**
 * 段階が切り替わるか確認をする
 */
const stageConfirm = async () => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // 周回数とボス番号を取得
  const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
  const [lap, , num] = await spreadsheet.GetCells(sheet, `${range[0]}:${range[2]}`)

  // キャルの段階ロールを切り替える
  const stage = getStageNow(Number(lap))
  switchStageRole(stage)

  // 1ボスない場合は終了
  if (num !== 'a') return

  // 段階数のセル
  const cells: string[][] = PiecesEach(await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.STAGE_CELLS), 2)
  const col = Settings.INFORMATION_SHEET.STAGE_COLUMN

  switch (lap) {
    case '4': {
      if (cells[1][1]) return
      return fetchStage(2, sheet, col)
    }

    case '11': {
      if (cells[2][1]) return
      return fetchStage(3, sheet, col)
    }

    case '35': {
      if (cells[3][1]) return
      return fetchStage(4, sheet, col)
    }

    case '45': {
      if (cells[4][1]) return
      return fetchStage(5, sheet, col)
    }
  }
}

/**
 * 現在の周回数から段階数の名前を返す
 * @param n 周回数
 * @return 段階数の名前
 */
const getStageNow = (lap: number) => {
  switch (true) {
    case lap < 4:
      return 'first'
    case lap < 11:
      return 'second'
    case lap < 35:
      return 'third'
    case lap < 45:
      return 'fourth'
    default:
      return 'fifth'
  }
}

/**
 * キャルの段階ロールを切り替える
 * @param stage 段階数の名前
 */
const switchStageRole = (stage: string) => {
  // キャルのユーザー情報を取得
  const cal = util.GetGuild()?.members.cache.get(Settings.CAL_ID)

  // 全ての段階ロールを外す
  Object.values(Settings.STAGE_ROLE_ID as string[]).forEach(id => cal?.roles.remove(id))

  // 現在の段階ロールを付ける
  cal?.roles.add(Settings.STAGE_ROLE_ID[stage])

  console.log("Switch Cal's stage role")
}

/**
 * 段階数の区切りとフラグを立てる
 * @param n 段階数
 * @param sheet 情報のシート
 * @param col フラグの列
 */
const fetchStage = async (n: number, sheet: any, col: string) => {
  // 4段階目までは区切りを入れる
  if (n < 5) category.SetSeparate(n)
  const cell = await sheet.getCell(`${col}${n + 2}`)
  cell.setValue(1)
}
