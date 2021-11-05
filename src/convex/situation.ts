import Settings from 'const-settings'
import * as current from '../io/current'
import * as dateTable from '../io/dateTable'
import * as status from '../io/status'
import * as util from '../util'
import {AtoE, Current, Member} from '../util/type'

/**
 * 凸状況を更新する
 * @param members メンバー一覧
 * @param state 現在の状況
 */
export const Report = async (members?: Member[], state?: Current) => {
  members ??= await status.Fetch()
  state ??= await current.Fetch()

  // 昇順ソート
  members = members.sort((a, b) => (a.name > b.name ? 1 : -1))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const history = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_HISTORY)

  // 全体状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.WHOLE)
    const text = await createWholeText(members, state)
    await msg.edit(text)
    await history.send(text)
  }
  // 残凸状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.CONVEX)
    const text = await createConvexText(members)
    await msg.edit(text)
    await history.send(text)
  }
  // 持越状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.OVER)
    const text = await createOverText(members)
    await msg.edit(text)
    await history.send(text)
  }
  // ボス状況
  {
    const msg = await channel.messages.fetch(Settings.SITUATION_MESSAGE_ID.BOSS)
    const text = await createBossText(members, state)
    await msg.edit(text)
  }

  console.log('Report convex situation')
}

/**
 * 全体状況のテキストを作成する
 * @param members メンバー一覧
 * @param state 現在の状況
 * @return 作成したテキスト
 */
const createWholeText = async (members: Member[], state: Current): Promise<string> => {
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
    '```ml',
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
const createConvexText = async (members: Member[]): Promise<string> => {
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
const createOverText = async (members: Member[]): Promise<string> => {
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

/**
 * ボス状況のテキストを作成する
 * @param members メンバー一覧
 * @param state 現在の状況
 * @return 作成したテキスト
 */
const createBossText = async (members: Member[], state: Current): Promise<string> => {
  const list = 'abcde'.split('').map(a => {
    // 凸宣言者一覧を取得
    const declares = members
      .filter(m => new RegExp(a, 'gi').test(m.declare))
      .map(m => {
        const convex = m.convex
        const over = '+'.repeat(m.over)
        const limit = m.limit !== '' ? `, ${m.limit}時` : ''

        return `${m.name}[${convex}${over}${limit}]`
      })

    const boss = state[<AtoE>a]
    const hp = Settings.STAGE[state.stage].HP[a]

    const percent = Math.ceil(20 * (boss.hp / hp))
    const bar = `[${'■'.repeat(percent)}${' '.repeat(20 - percent)}]`

    const icon = boss.lap - state.lap >= 2 ? '🎁' : boss.lap - state.lap >= 1 ? '+1' : ''

    return [
      '```m',
      `${boss.lap}周目 ${boss.name} ${icon}`,
      `${bar} ${boss.hp}/${hp}`,
      `${declares.length ? declares.join(', ') : ' '}`,
      '```',
    ].join('\n')
  })

  return ['ボス状況', ...list].join('\n')
}
