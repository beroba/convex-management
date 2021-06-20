import Settings from 'const-settings'
import * as util from '../../util'
import * as dateTable from '../../io/dateTable'
import * as current from '../../io/current'
import {Current, Member} from '../../io/type'

/**
 * 凸状況に報告をする
 * @param members メンバー一覧
 */
export const Report = async (members: Member[]) => {
  // #凸状況のテキストを作成
  const text = await createMessage(members)

  // #凸状況を更新
  const situation = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const msg = await situation.messages.fetch(Settings.CONVEX_MESSAGE_ID.SITUATION)
  msg.edit(text)

  // #凸状況履歴に報告
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)
  history.send(text)

  console.log('Report convex situation')
}

/**
 * 凸状況のテキストを作成する
 * @param members メンバー一覧
 * @return 作成したテキスト
 */
const createMessage = async (members: Member[]): Promise<string> => {
  // 現在の日付と時刻を取得
  const time = getCurrentDate()

  // クラバトの日数を取得
  const date = await dateTable.TakeDate()

  // 現在の状況を取得
  const state = await current.Fetch()

  // 残り凸数を計算
  const 残り凸数 = remainingConvexNumber(members)

  // 現在の段階を数字で取得
  const stage = Settings.STAGE[state.stage].NUMBER

  // 次の段階までの凸数を計算
  const 次の段階までの凸数 = lapsToTheNextStage(state)

  // 全員の凸状況を見て残り凸数で振り分ける
  const 未凸 = userSorting(members, 0)
  const 凸1 = userSorting(members, 1)
  const 凸2 = userSorting(members, 2)
  const 凸3 = userSorting(members, 3, '1-3')
  const 完凸済 = userSorting(members, 3, 0)

  // 全員の凸状況を見て持越数で振り分ける
  const 持越3 = userSorting(members, undefined, 3)
  const 持越2 = userSorting(members, undefined, 2)
  const 持越1 = userSorting(members, undefined, 1)

  return [
    `\`${time}\` ${date.num} 凸状況一覧`,
    `\`${stage}\`段階目 残り\`${次の段階までの凸数}\`周`,
    `\`${state.lap}\`周目 \`${残り凸数}\``,
    '```',
    `未凸: ${未凸}`,
    `1凸目: ${凸1}`,
    `2凸目: ${凸2}`,
    `3凸目: ${凸3}`,
    `完凸済: ${完凸済}`,
    '```',
    '持越状況',
    '```',
    `3つ: ${持越3}`,
    `2つ: ${持越2}`,
    `1つ: ${持越1}`,
    '```',
  ].join('\n')
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
 * @param members メンバー全員の状態
 * @return 計算結果
 */
const remainingConvexNumber = (members: Member[]): string => {
  // 残り凸数を計算
  const remaining = members.map(s => 3 - Number(s.convex) + Number(s.over)).reduce((a, b) => a + b)
  // 残り持越数を計算
  const over = members.map(s => Number(s.over)).reduce((a, b) => a + b)
  return `${remaining}/${members.length * 3}(${over})`
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
 * 引数で渡された凸数と持越のメンバーを取得
 * @param members メンバー全員の状態
 * @param convex 凸数
 * @param over 持越状況
 * @return 取得したメンバー一覧
 */
const userSorting = (members: Member[], convex?: number, over?: number | '1-3'): string => {
  // 凸数で絞る
  if (convex !== undefined) {
    members = members.filter(l => Number(l.convex) === convex)
  }

  // 持越で絞る
  if (over !== undefined) {
    members = over === '1-3' ? members.filter(l => Number(l.over) !== 0) : members.filter(l => Number(l.over) === over)
  }

  // リストから名前を`, `で繋げて返す
  return members.map(l => l.name).join(', ')
}
