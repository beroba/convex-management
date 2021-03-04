import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as current from '../../io/current'
import * as category from '../command/category'
import * as declare from '../declare'

/**
 * 現在の周回数とボスを変更する
 * @param arg 変更したい周回数とボス番号
 * @return Updateしたかの真偽値
 */
export const Update = async (arg: string): Promise<boolean> => {
  // 周回数とボス番号を取得
  const [lap, alpha] = arg.replace(/　/g, ' ').split(' ')

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return false
  if (!/[a-e]/i.test(alpha)) return false

  // 現在の状況を更新
  const state = await current.UpdateLapAndBoss(lap, alpha)
  await util.Sleep(50)

  // 凸宣言のボスを変更
  declare.ChangeBoss(state)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()

  // 段階数の区切りを付ける
  stageConfirm()

  return true
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
  await util.Sleep(50)

  // 凸宣言のボスを変更
  declare.ChangeBoss(newState)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()

  // 段階数の区切りを付ける
  stageConfirm()
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
  await util.Sleep(50)

  // 凸宣言のボスを変更
  declare.ChangeBoss(newState)

  // 進行に現在のボスと周回数を報告
  ProgressReport()

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet()

  // 段階数の区切りを付ける
  stageConfirm()
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

/**
 * 段階が切り替わるタイミングを確認する
 */
const stageConfirm = async () => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 1ボスでない場合は終了
  if (state.alpha !== 'a') return

  switch (state.lap) {
    // 2段階目
    case '4': {
      return category.CheckTheStage(2)
    }
    // 3段階目
    case '11': {
      return category.CheckTheStage(3)
    }
    // 4段階目
    case '35': {
      return category.CheckTheStage(4)
    }
    // 5段階目
    case '45': {
      return category.CheckTheStage(5)
    }
  }
}
