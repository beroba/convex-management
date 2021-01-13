import Settings from 'const-settings'
import * as dateTable from '../../io/dateTable'
import * as current from '../../io/current'
import * as members from '../../io/members'
import {Member} from '../../io/type'
import * as util from '../../util'

/**
 * 凸状況に報告をする
 */
export const Report = async () => {
  // 凸状況のテキストを作成
  const text = await createMessage()

  // 凸状況を更新
  const situation = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const msg = await situation.messages.fetch(Settings.CONVEX_MESSAGE_ID.SITUATION)
  msg.edit(text)

  // #凸状況履歴に報告
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)
  history.send(text)

  console.log('Report convex situation')
}

// prettier-ignore
/**
 * 凸状況のテキストを作成する
 * @return 作成したテキスト
 */
const createMessage = async (): Promise<string> => {
  // 現在の日付と時刻を取得
  const time = getCurrentDate()

  // クラバトの日数を取得
  const date = await dateTable.TakeDate()

  // 現在の状況を取得
  const state = await current.Fetch()

  // メンバー全員の状態を取得
  const status = await members.Fetch()

  // 残り凸数を計算する
  const remaining = remainingConvexNumber(status)

  // 全員の凸状況を見て振り分ける
  const 未凸  = userSorting(status, 0, 0)
  const 持越1 = userSorting(status, 1, 1)
  const 凸1   = userSorting(status, 1, 0)
  const 持越2 = userSorting(status, 2, 1)
  const 凸2   = userSorting(status, 2, 0)
  const 持越3 = userSorting(status, 3, 1)
  const 凸3   = userSorting(status, 3, 0)

  return (
    `\`${time}\` ${date.num} 凸状況一覧\n` +
    `\`${state.lap}\`周目の\`${state.boss}\` \`${remaining}\`\n` +
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
 * 残り凸数を計算
 * @param status メンバー全員の状態
 * @return 計算結果
 */
const remainingConvexNumber = (status: Member[]): string => {
  // 残り凸数を計算
  const remaining = status.map(s => 3 - Number(s.convex) + Number(s.over)).reduce((a, b) => a + b)
  // 残り持ち越し数を計算
  const over = status.map(s => Number(s.over)).reduce((a, b) => a + b)
  return `${remaining}/${status.length * 3}(${over})`
}

/**
 * 引数で渡された凸数と持ち越しのメンバーを取得
 * @param status メンバー全員の状態
 * @param convex 凸数
 * @param over 持ち越し状況
 * @return 取得したメンバー一覧
 */
const userSorting = (status: Member[], convex: number, over: number): string =>
  status
    .filter(l => Number(l.convex) === convex)
    .filter(l => Number(l.over) === over)
    .map(l => l.name)
    .join(', ')
