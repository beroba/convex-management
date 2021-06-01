import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as declare from '../declare'
import {Current, AtoE} from '../../io/type'

/**
 * 現在の周回数を変更する
 * @param lap 周回数
 */
export const UpdateLap = async (lap: string) => {
  // 現在の状況を取得
  let state = await current.Fetch()

  // 現在の状況を更新
  state = await current.UpdateLap(state, lap)
  await util.Sleep(100)

  // #進行に報告
  await StageReport(state)

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()
}

/**
 * ボスの討伐状況を変更する
 * @param alpha 討伐するボス番号
 */
export const SubjugateBoss = async (alpha: string) => {
  // 現在の状況を取得
  let state = await current.Fetch()

  // 複数ボスの場合が指定されていた場合の為に分割する
  alpha.split('').map(async alp => {
    const a = alp as AtoE

    // HPを取得
    const hp: number = Settings.STAGE[state.stage].HP[a]

    // 現在のボス状況を更新
    state = await current.UpdateBoss(state, a, hp)
    await util.Sleep(100)

    // 凸宣言のボスを変更
    declare.RevivalBoss(state, a)

    // #進行に報告
    await SubjugateReport(state, a)
  })

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()
}

/**
 * #進行に現在の周回数を報告
 * @param state 現在の状況
 */
export const StageReport = async (state: Current) => {
  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${Settings.ROLE_ID.PLAN_CONVEX}> \`${state.lap}\`周目`)
}

/**
 * #進行に討伐したボスを報告
 * @param state 現在の状況
 */
export const SubjugateReport = async (state: Current, alpha: AtoE) => {
  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  await channel.send(`\`${state.lap}\`周目 \`${state[alpha].name}\` 討伐`)
}
