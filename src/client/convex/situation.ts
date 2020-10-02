import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {AtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as lapAndBoss from './lapAndBoss'
import * as date from './date'

/**
 * 凸状況に報告をする
 */
export const Report = async () => {
  // 凸報告のシートを取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバー一覧と凸状況を取得
  const days = await date.CheckCalnBattle()
  const range = `${days[2]}3:${AtoA(days[2], 1)}32`
  const status: string[] = await spreadsheet.GetCells(manageSheet, range)
  const members: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)

  // 1つにマージする
  const list: (string | number)[][] = PiecesEach(status, 2)
    .map(v => v.map(Number))
    .map((v, i) => [members[i], ...v])
    .filter(v => v[0] !== '')

  // #凸状況に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  channel.send(await createMessage(list))

  console.log('Report convex situation')
}

// prettier-ignore
/**
 * 送信するメッセージを作成する
 * @param list 凸状況一覧
 */
const createMessage = async (list: (string | number)[][]): Promise<string> => {
  // 現在の日付と時刻を取得
  const p0 = (n: number): string => (n + '').padStart(2, '0')
  const time = (d =>
    `${p0(d.getMonth() + 1)}/${p0(d.getDate())} ${p0(d.getHours())}:${p0(d.getMinutes())}`
  )(new Date())

  // クラバトの日数を取得
  const day = `${await date.GetDay()}日目`

  // 現在の周回数とボスを取得
  const state = await lapAndBoss.GetCurrent()
  const current = `\`${state.lap}\`周目の\`${state.boss}\``

  // 全員の凸状況を見て振り分ける
  const getUserList = (list: (string | number)[][], a: number, b: number): string =>
    list.filter(l => l[1] === a).filter(l => l[2] === b).map(l => l[0]).join(', ')
  const 未凸  = getUserList(list, 0, 0)
  const 持越1 = getUserList(list, 1, 1)
  const 凸1   = getUserList(list, 1, 0)
  const 持越2 = getUserList(list, 2, 1)
  const 凸2   = getUserList(list, 2, 0)
  const 持越3 = getUserList(list, 3, 1)
  const 凸3   = getUserList(list, 3, 0)

  return (
    `\`${time}\` ${day} 凸状況一覧\n` +
    `${current}\n` +
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
