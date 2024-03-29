import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as declare from './declare'
import * as current from '../io/current'
import * as damageList from '../io/damageList'
import * as list from './declare/list'
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
  const l = state.lap
  state = await current.Update(hp, alpha, state)

  // ボスが討伐されているか確認
  if (hp <= 0) {
    await progressReport(alpha, state)
    await declare.NextBoss(alpha, state)
  }

  // 周回数が変わったら通知
  if (state.lap > l) {
    await progressLap(state.lap)
    await damageReportUpdate(alpha, state)
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
  let state = await current.Fetch()

  // 変更前の周回数
  const l = state.lap

  // ボスのHPを取得
  const hp = Settings.STAGE[state.stage].HP[alpha]

  state = await current.Update(hp, alpha, state, lap)
  await progressReport(alpha, state)
  await declare.NextBoss(alpha, state)

  // 周回数が変わったら通知
  if (state.lap > l) {
    await progressLap(state.lap)
    await damageReportUpdate(alpha, state)
  }

  return state
}

/**
 * #進行-連携に現在の周回数とボスを報告
 * @param alpha ボス番号
 * @param state 現在の状況
 */
const progressReport = async (alpha: AtoE, state: Current): Promise<Discord.Message> => {
  const role = Settings.BOSS_ROLE_ID[alpha]

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  return channel.send(`<@&${role}>\n\`${state[alpha].lap}\`周目 \`${state[alpha].name}\``)
}

/**
 * #進行-連携に全体の周回数を報告
 * @param lap 周回数
 */
const progressLap = async (lap: number) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  await channel.send(`全体\`${lap}\`周目`)
}

/**
 * 全てのボスのダメージ報告を更新
 * @param alpha ボス番号
 * @param state 現在の状況
 */
const damageReportUpdate = async (alpha: AtoE, state: Current) => {
  'abcde'
    .replace(alpha, '')
    .split('')
    .forEach(async a => {
      const damages = await damageList.DeleteBoss(alpha)
      list.SetDamage(<AtoE>a, state, undefined, damages)
    })
}
