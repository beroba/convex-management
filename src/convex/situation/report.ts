import Settings from 'const-settings'
import * as dateTable from '../dateTable'
import {Current, Member} from '../../util/type'

/**
 * 全体状況のテキストを作成する
 * @param members メンバー一覧
 * @param state 現在の状況
 * @return 作成したテキスト
 */
export const CreateWholeText = async (members: Member[], state: Current): Promise<string> => {
  // 日付と時刻
  const time = getCurrentDate()
  const date = await dateTable.TakeDate()

  // 残り凸数
  const remainingConvex = remainingConvexNumber(members)

  // 段階
  const stage = Settings.STAGE[state.stage].NUMBER

  // 次の段階までの凸数
  const nextStage = lapsToTheNextStage(state)

  const 完凸済 = perfectConvexNumber(members)

  return [
    '全体状況',
    '```ts',
    `${time} ${date.num} 凸状況一覧`,
    `${stage}段階目 残り${nextStage}周`,
    `${state.lap}周目 ${remainingConvex}`,
    `完凸人数 ${完凸済}人`,
    '```',
  ].join('\n')
}

/**
 * 現在の日付と時刻を取得
 * @return 取得した文字列
 */
const getCurrentDate = (): string => {
  const d = new Date()
  const MM = (d.getMonth() + 1).padStart(2, '0')
  const dd = d.getDate().padStart(2, '0')
  const HH = d.getHours().padStart(2, '0')
  const mm = d.getMinutes().padStart(2, '0')
  return `${MM}/${dd} ${HH}:${mm}`
}

/**
 * 残り凸数を計算
 * @param members メンバー全員の状態
 * @return 計算結果
 */
const remainingConvexNumber = (members: Member[]): string => {
  const length = members.length * 3
  // 残り凸数
  const remaining = members.map(s => s.convex + s.over).reduce((a, b) => a + b)
  // 残り持越数
  const over = members.map(s => s.over).reduce((a, b) => a + b)

  return `${remaining}/${length}(${over}) 進捗${100 - Math.ceil((remaining / length) * 100)}%`
}

/**
 * 次の段階までの周回数を計算する
 * @param state 現在の状態
 * @return 必要な周回数
 */
const lapsToTheNextStage = (state: Current): number | string => {
  switch (true) {
    case state.lap <= Settings.STAGE.FIRST.LAP.last():
      return Settings.STAGE.FIRST.LAP.last() - state.lap + 1
    case state.lap <= Settings.STAGE.SECOND.LAP.last():
      return Settings.STAGE.SECOND.LAP.last() - state.lap + 1
    case state.lap <= Settings.STAGE.THIRD.LAP.last():
      return Settings.STAGE.THIRD.LAP.last() - state.lap + 1
    case state.lap <= Settings.STAGE.FOURTH.LAP.last():
      return Settings.STAGE.FOURTH.LAP.last() - state.lap + 1
    default:
      return '-'
  }
}

/**
 * 完凸済の人数を返す
 * @param members メンバー全員の状態
 * @return 完凸済の人数
 */
const perfectConvexNumber = (members: Member[]): number => {
  members = members.filter(l => l.convex === 0)
  members = members.filter(l => l.over === 0)
  return members.length
}

/**
 * 残凸状況のテキストを作成する
 * @param members メンバー一覧
 * @return 作成したテキスト
 */
export const CreateConvexText = async (members: Member[]): Promise<string> => {
  // 全員の凸状況
  const 残凸3 = userSorting(members, 3)
  const 残凸2 = userSorting(members, 2)
  const 残凸1 = userSorting(members, 1)
  const 残凸0 = userSorting(members, 0, '1-3')
  const 完凸済 = userSorting(members, 0, 0)

  return [
    '残凸状況',
    '```',
    `残凸3: ${残凸3}`,
    `残凸2: ${残凸2}`,
    `残凸1: ${残凸1}`,
    `残凸0: ${残凸0}`,
    `完凸済: ${完凸済}`,
    '```',
  ].join('\n')
}

/**
 * 持越状況のテキストを作成する
 * @param members メンバー一覧
 * @return 作成したテキスト
 */
export const CreateOverText = async (members: Member[]): Promise<string> => {
  // 全員の持越数
  const 持越3 = userSorting(members, undefined, 3)
  const 持越2 = userSorting(members, undefined, 2)
  const 持越1 = userSorting(members, undefined, 1)

  // prettier-ignore
  return [
    '持越状況',
    '```',
    `持越3: ${持越3}`,
    `持越2: ${持越2}`,
    `持越1: ${持越1}`,
    '```',
  ].join('\n')
}

/**
 * 引数で渡された凸数と持越のメンバーを取得
 * @param members メンバー全員の状態
 * @param convex 凸数
 * @param over 持越状況
 * @return 取得したメンバー一覧
 */
const userSorting = (members: Member[], convex?: number, over?: number | '1-3'): string => {
  // 凸数で絞る
  if (convex !== undefined) {
    members = members.filter(l => l.convex === convex)
  }

  // 持越で絞る
  if (over !== undefined) {
    members = over === '1-3' ? members.filter(l => l.over !== 0) : members.filter(l => l.over === over)
  }

  return members.map(l => l.name).join(', ')
}
