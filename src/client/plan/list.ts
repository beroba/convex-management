import {NtoA} from 'alphabet-to-number'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as bossTable from '../../io/bossTable'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as lapAndBoss from '../convex/lapAndBoss'

/**
 * 引数で渡されたボス番号の凸予定一覧を出力
 * @param num ボス番号
 */
export const Output = async (alpha: string) => {
  const list = await readPlanList()
  const name = await bossTable.TakeName(alpha)

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`${name}\n` + '```\n' + `${createPlanList(alpha, list)}\n` + '```')
}

/**
 * 全凸予定一覧を出力
 */
export const AllOutput = async () => {
  const text = await createAllPlanText()

  // 凸予定一覧を出力
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(text)
}

/**
 * #凸状況の凸予定を編集
 */
export const SituationEdit = async () => {
  const text = await createAllPlanText()

  // 凸状況を更新
  const situation = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const msg = await situation.messages.fetch(Settings.CONVEX_MESSAGE_ID.PLAN)
  msg.edit(text)

  console.log('Edit the convex schedule of the convex situation')
}

/**
 * 全凸予定の一覧のテキストを作成
 * @return 作成したテキスト
 */
const createAllPlanText = async (): Promise<string> => {
  const list = await readPlanList()

  // 現在のボス番号と段階数を取得
  // const current = lapAndBoss.CalCurrent()

  const planTexts = await Promise.all(
    lapAndBoss.StageNames.map(async (_name, i) => {
      // ボス番号を取得
      const alpha = NtoA(i + 1)
      const name = await bossTable.TakeName(alpha)
      // const HP = Settings.STAGE_HP[current?.stage || ''][name]

      return `${name}\n` + '```\n' + `${createPlanList(alpha, list)}\n` + '```'
      // return `${boss} \`${HP}\`\n` + '```\n' + `${createPlanList(alpha, list)}\n` + '```'
    })
  )
  return planTexts.join('')
}

/**
 * 引数で渡されたボス番号の凸予定一覧を出力。
 * ボス名は表示しない
 * @param num ボス番号
 */
export const PlanOnly = async (num: string) => {
  const list = await readPlanList()

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send('```\n' + `${createPlanList(num, list)}\n` + '```')
}

/**
 * 完了していない凸予定一覧を取得
 * @return 完了していない凸予定一覧
 */
const readPlanList = async (): Promise<string[][]> => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 空の値と完了済みの値を省いて返す
  return PiecesEach(cells, 8)
    .filter(v => !/^,+$/.test(v.toString()))
    .filter(v => !v[0])
}

/**
 * 凸予定一覧から渡されたボス番号の予定者一覧を返す
 * @param num ボス番号
 * @param list 凸予定一覧
 * @return 予定者一覧のテキスト
 */
const createPlanList = (num: string, list: string[][]): string => {
  const text = list
    .filter(l => l[5] === num)
    .map(l => `${l[3]} ${l[7]}`)
    .join('\n')

  // 予定者が居ない場合は空白を返す
  return text ? text : ' '
}
