import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as lapAndBoss from './lapAndBoss'
import * as convex from '.'

/**
 * メンバー毎の凸状況
 */
type ConvexStatus = {
  member: string
  number: number
  over: number
}

/**
 * 凸状況に報告をする
 */
export const Report = async () => {
  // 凸報告のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 凸状況とメンバー一覧を取得
  const days = await convex.GetDay()
  const range = `${days[2]}3:${AtoA(days[2], 1)}32`
  const status: number[][] = PiecesEach((await spreadsheet.GetCells(sheet, range)).map(Number), 2)

  const cells = await spreadsheet.GetCells(sheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const members: string[][] = PiecesEach(cells, 2).filter(v => v)

  // 1つにマージする
  const list: ConvexStatus[] = mergeList(status, members)

  // 現在の凸状況を取得
  const text = await createMessage(list)

  // 凸状況を更新
  const situation = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const msg = await situation.messages.fetch(Settings.CONVEX_MESSAGE_ID.SITUATION)
  msg.edit(text)

  // #凸状況履歴に報告
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)
  history.send(text)

  console.log('Report convex situation')
}

/**
 * 凸状況とクランメンバー一覧を1つにまとめる
 * @param status 凸状況一覧
 * @param members クランメンバー一覧
 * @return メンバー毎の凸状況一覧
 */
const mergeList = (status: number[][], members: string[][]): ConvexStatus[] =>
  status
    .map((v, i) => ({
      member: members[i][0],
      number: v[0],
      over: v[1],
    }))
    .filter(v => v.member !== '')

// prettier-ignore
/**
 * 送信するメッセージを作成する
 * @param list 凸状況一覧
 */
const createMessage = async (list: ConvexStatus[]): Promise<string> => {
  // 現在の日付と時刻を取得
  const time = getCurrentDate()

  // クラバトの日数を取得
  const day = (await convex.GetDay())[0]

  // 現在の周回数とボスを取得
  const state = await lapAndBoss.GetCurrent()
  const current = `\`${state.lap}\`周目の\`${state.boss}\``

  // 残り凸数を計算する
  const remaining = remainingConvexNumber(list)

  // 全員の凸状況を見て振り分ける
  const 未凸  = userSorting(list, 0, 0)
  const 持越1 = userSorting(list, 1, 1)
  const 凸1   = userSorting(list, 1, 0)
  const 持越2 = userSorting(list, 2, 1)
  const 凸2   = userSorting(list, 2, 0)
  const 持越3 = userSorting(list, 3, 1)
  const 凸3   = userSorting(list, 3, 0)

  return (
    `\`${time}\` ${day} 凸状況一覧\n` +
    `${current} \`${remaining}\`\n` +
    '```\n' +
    `未凸: ${未凸}\n` +
    '\n' +
    `持越: ${持越1}\n` +
    `1凸 : ${凸1}\n` +
    '\n' +
    `持越: ${持越2}\n` +
    `2凸 : ${凸2}\n` +
    '\n' +
    `持越: ${持越3}\n` +
    `3凸 : ${凸3}\n` +
    '\n' +
    '```'
  )
}

/**
 * 現在の日付と時刻を取得
 * @return 取得した文字列
 */
const getCurrentDate = (): string => {
  const p0 = (n: number): string => (n + '').padStart(2, '0')
  const d = new Date()
  return `${p0(d.getMonth() + 1)}/${p0(d.getDate())} ${p0(d.getHours())}:${p0(d.getMinutes())}`
}

/**
 * 凸状況のに一覧したユーザーを取得
 * @param list 凸状況のリスト
 * @param number 凸数
 * @param over 持ち越し状況
 * @return 取得したユーザー一覧
 */
const userSorting = (list: ConvexStatus[], number: number, over: number): string =>
  list
    .filter(l => l.number === number)
    .filter(l => l.over === over)
    .map(l => l.member)
    .join(', ')

/**
 * 残り凸数を計算
 * @param list 凸状況のリスト
 * @return 計算結果
 */
const remainingConvexNumber = (list: ConvexStatus[]): string => {
  const remaining = list.map(l => 3 - l.number + l.over).reduce((a, b) => a + b)
  const over = list.map(l => l.over).reduce((a, b) => a + b)
  return `${remaining}/${list.length * 3}(${over})`
}
