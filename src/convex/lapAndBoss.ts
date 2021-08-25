import Settings from 'const-settings'
import * as declare from './declare'
import * as react from './declare/react'
import * as current from '../io/current'
import * as util from '../util'
import {AtoE, Current} from '../util/type'

/**
 * ボスのHPを変更する
 * @param hp 変更先のHP
 * @param alpha ボス番号
 * @param state 現在の状況
 * @return 現在の状況
 */
export const UpdateHP = async (hp: number, alpha: AtoE, state: Current): Promise<Current> => {
  // 変更前の周回数
  const lap = state.lap

  // 現在の状況を更新
  state = await current.Update(hp, alpha, state)

  // ボスが討伐されているか確認
  if (hp <= 0) {
    // 進行に通知をする
    await progressReport(alpha, state)

    // 次のボスに進める
    await declare.NextBoss(alpha, state)
  }

  // 周回数が変わったら通知
  if (state.lap > lap) {
    await progressLap(state.lap)
  }

  return state
}

/**
 * ボスの周回数を変更する
 * @param lap 変更先の周回数
 * @param alpha ボス番号
 * @return 現在の状況
 */
export const UpdateLap = async (lap: number, alpha: AtoE): Promise<Current> => {
  // 現在の状況を取得
  let state = await current.Fetch()

  // 変更前の周回数
  const l = state.lap

  // ボスのHPを取得
  const hp = Settings.STAGE[state.stage].HP[alpha]

  // 現在の状況を更新
  state = await current.Update(hp, alpha, state, lap)

  // 討伐通知を送信
  await progressReport(alpha, state)

  // 次のボスに進める
  await declare.NextBoss(alpha, state)

  // 周回数が変わったら通知
  if (state.lap > l) {
    await progressLap(state.lap)
  }

  return state
}

/**
 * #進行-連携に現在の周回数とボスを報告
 * @param alpha ボス番号
 * @param state 現在の状況
 */
const progressReport = async (alpha: AtoE, state: Current) => {
  // ボスのロールを取得
  const role = Settings.BOSS_ROLE_ID[alpha]

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // #進行-連携に次のボスを報告
  await channel.send(`<@&${role}>\n\`${state[alpha].lap}\`周目 \`${state[alpha].name}\``)

  // 開放通知のメッセージを取得
  const text = await react.OpenNotice(alpha)
  if (!text) return

  // #進行-連携に開放通知を報告
  await channel.send(text)
}

/**
 * #進行-連携に全体の周回数を報告
 * @param lap 周回数
 */
const progressLap = async (lap: number) => {
  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // #進行-連携に全体の周が変わった事を報告
  await channel.send(`全体\`${lap}\`周目`)
}
