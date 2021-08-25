import Settings from 'const-settings'
import * as io from './redis'
import * as bossTable from './bossTable'
import * as declare from '../convex/declare/status'
import {AtoE, Current, CurrentBoss} from '../util/type'

/**
 * 現在のボス状況を設定する
 * @param hp 残りHP
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param state ボスの周回数
 * @return 現在の状況
 */
export const Update = async (hp: number, alpha: AtoE, state: Current, lap?: number): Promise<Current> => {
  // ボス番号(英語)からボス番号(数字)とボス名を取得
  const num = (await bossTable.TakeNum(alpha)) ?? ''
  const name = (await bossTable.TakeName(alpha)) ?? ''

  // ボスのHPを取得
  const max = Settings.STAGE[state.stage].HP[alpha]

  // HPが0以下の場合、0にする
  hp = hp < 0 ? 0 : hp

  // HPが0の場合は次の周に進める
  lap ??= state[alpha].lap + (hp ? 0 : 1)

  // HPが0の場合は最大にする
  hp = hp || max

  // HPが最大以上の場合、最大にする
  hp = hp > max ? max : hp

  // ボス状況を更新
  state[alpha] = <CurrentBoss>{
    alpha: alpha,
    num: num,
    name: name,
    lap: lap,
    hp: hp,
  }

  // 全体の周回数を更新
  state = updateLap(state)

  // キャルステータスを更新
  await io.UpdateJson('current', state)

  return state
}

/**
 * 現在の状況の段階と周回数を設定する
 * @param state 現在の状況
 * @param lap 周回数
 * @return 現在の状況
 */
const updateLap = (state: Current): Current => {
  // 全てのボスの周回数から1番進んでいない周回数を取得
  const lap = Math.min(...'abcde'.split('').map(a => state[<AtoE>a].lap))

  // 全体の周回数よりボスの周回数が進んでいる場合は更新
  if (state.lap !== lap) {
    // 周回数を更新
    state.lap = lap
  }

  // 周回数から段階を取得
  const stage = getStageName(lap)

  // 全体の段階とボスの段階が違うは更新
  if (state.stage !== stage) {
    // 段階を更新
    state.stage = stage

    // ボスのHPを更新
    'abcde'.split('').forEach(a => {
      // ボスのHPを取得
      const hp = Settings.STAGE[state.stage].HP[a]
      state[<AtoE>a].hp = hp

      // 全ボスの凸宣言を更新
      declare.Update(<AtoE>a, state)
    })
  }

  return state
}

/**
 * 現在の周回数から段階名を返す
 * @param lap 周回数
 * @return 段階名
 */
const getStageName = (lap: number): string => {
  switch (true) {
    case lap < Settings.STAGE.SECOND.LAP.first():
      return 'FIRST'
    case lap < Settings.STAGE.THIRD.LAP.first():
      return 'SECOND'
    case lap < Settings.STAGE.FOURTH.LAP.first():
      return 'THIRD'
    case lap < Settings.STAGE.FIFTH.LAP.first():
      return 'FOURTH'
    default:
      return 'FIFTH'
  }
}

/**
 * キャルステータスから現在の状況を取得
 * @return 現在の状況
 */
export const Fetch = async (): Promise<Current> => io.Fetch<Current>('current')
