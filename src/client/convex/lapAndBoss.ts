import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as current from '../../io/current'
import * as declare from '../declare'

/**
 * 現在の周回数とボスを変更する
 * @param lap 周回数
 */
export const Update = async (lap: string, alpha: string) => {
  // 現在の状況を更新
  const newState = await current.UpdateLapAndBoss(lap, alpha)
  await util.Sleep(100)

  // 凸宣言のボスを変更
  declare.ChangeBoss(newState)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()
}

/**
 * 現在の周回数とボスを次に進める
 */
export const Next = async () => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 次の周回数とボスへ進める
  const lap = String(Number(state.lap) + (state.alpha === 'e' ? 1 : 0))
  const alpha = NtoA(state.alpha === 'e' ? 1 : Number(state.num) + 1)

  // 現在の状況を更新
  const newState = await current.UpdateLapAndBoss(lap, alpha)
  await util.Sleep(100)

  // 凸宣言のボスを変更
  declare.ChangeBoss(newState)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()
}

/**
 * 現在の周回数とボスを前に戻す
 */
export const Previous = async () => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 次の周回数とボスへ進める
  const lap = String(Number(state.lap) - (state.alpha === 'a' ? 1 : 0))
  const alpha = NtoA(state.alpha === 'a' ? 5 : Number(state.num) - 1)

  // 現在の状況を更新
  const newState = await current.UpdateLapAndBoss(lap, alpha)
  await util.Sleep(100)

  // 凸宣言のボスを変更
  declare.ChangeBoss(newState)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()
}

/**
 * #進行に現在の周回数とボスを報告
 */
export const ProgressReport = async () => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // ボスのロールを取得
  const role = Settings.BOSS_ROLE_ID[state.alpha]

  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${role}>\n\`${state.lap}\`周目 \`${state.boss}\``)
}
