import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as lapAndBoss from './lapAndBoss'
import * as date from './date'

/**
 * 凸状況に報告をする
 */
export const Report = async () => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return

  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // メンバー一覧と凸状況を取得
  const range = `${await date.GetColumn(0)}3:${await date.GetColumn(1)}32`
  const status: string[] = await spreadsheet.GetCells(manageSheet, range)
  const members: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)

  // 1つにマージする
  const list: (string | number)[][] = util
    .PiecesEach(status, 2)
    .map(v => v.map(Number))
    .map((v, i) => [members[i], ...v])
    .filter(v => v[0] !== '')

  const channel = util.GetTextChannel(Settings.CONVEX_CHANNEL.SITUATION_ID)
  channel.send(await createMessage(list))
}

// prettier-ignore
/**
 * 送信するメッセージを作成する
 * @param list 凸状況一覧
 */
const createMessage = async (list: (string | number)[][]): Promise<string> => {
  const pad0 = (n: number): string => (n + '').padStart(2, '0')
  const time = (d =>
    `${pad0(d.getMonth() + 1)}/${pad0(d.getDate())} ${pad0(d.getHours())}:${pad0(d.getMinutes())}`
  )(new Date())
  const day = `${await date.GetDay()}日目`

  const 未凸  = list.filter(l => l[1] === 0).map(l => l[0])
  const 持越1 = list.filter(l => l[1] === 1).filter(l => l[2] === 1).map(l => l[0])
  const 凸1   = list.filter(l => l[1] === 1).filter(l => l[2] === 0).map(l => l[0])
  const 持越2 = list.filter(l => l[1] === 2).filter(l => l[2] === 1).map(l => l[0])
  const 凸2   = list.filter(l => l[1] === 2).filter(l => l[2] === 0).map(l => l[0])
  const 持越3 = list.filter(l => l[1] === 3).filter(l => l[2] === 1).map(l => l[0])
  const 凸3   = list.filter(l => l[1] === 3).filter(l => l[2] === 0).map(l => l[0])

  return (
    `\`${time}\` ${day} 凸状況一覧\n` +
    '```\n' +
    `未凸: ${未凸.toString().replace(/,/g, ', ')}\n` +
    '\n' +
    `持越: ${持越1.toString().replace(/,/g, ', ')}\n` +
    `1凸 : ${凸1.toString().replace(/,/g, ', ')}\n` +
    '\n' +
    `持越: ${持越2.toString().replace(/,/g, ', ')}\n` +
    `2凸 : ${凸2.toString().replace(/,/g, ', ')}\n` +
    '\n' +
    `持越: ${持越3.toString().replace(/,/g, ', ')}\n` +
    `3凸 : ${凸3.toString().replace(/,/g, ', ')}\n` +
    '\n' +
    '```\n' +
    `${await lapAndBoss.CurrentMessage()}`
  )
}
