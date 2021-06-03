import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as declare from '../declare'
import {AtoE, Current, Member} from '../../io/type'

/**
 * 現在の周回数を変更する
 * @param lap 周回数
 * @state state 現在の状況
 */
export const UpdateLap = async (lap: string, state?: Current): Promise<Current> => {
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 全員の凸宣言をリセット
  await status.ResetDeclare()

  // 現在の状況を更新
  let st = await current.UpdateLap(state, lap)
  await util.Sleep(100)

  // 全てのボスを復活させる
  st = await Promise.all(
    'abcde'.split('').map(async alpha => {
      const hp = Settings.STAGE[st.stage].HP[alpha]
      st = await current.UpdateBoss(hp, alpha as AtoE, st)
      await declare.RevivalBoss(alpha as AtoE, st)
    })
  ).then(async () => {
    // #進行に報告
    await StageReport(st)

    // 現在の状況をスプレッドシートに反映
    current.ReflectOnSheet(st)

    return st
  })

  return st
}

/**
 * ボスのHPを変更する
 * @param alpha ボス番号
 * @state state 現在の状況
 */
export const UpdateBoss = async (hp: number, alpha: AtoE, state?: Current): Promise<Current> => {
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 現在の状況を更新
  let st = await current.UpdateBoss(hp, alpha, state)
  await util.Sleep(100)

  // ボスが討伐されたら
  if (st[alpha].subjugate) {
    // 討伐通知をする
    await SubjugateReport(alpha, st)

    // 開放通知をする
    await ReleaseNotice(alpha)
  }

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet(st)

  return st
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
 * @param alpha ボス番号
 * @param state 現在の状況
 */
export const SubjugateReport = async (alpha: AtoE, state: Current) => {
  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  await channel.send(`\`${state.lap}\`周目 \`${state[alpha].name}\` 討伐`)
}

/**
 * #進行-連携に開放通知を行う
 * @param users メンションを行うユーザー一覧
 */
export const ReleaseNotice = async (alpha: AtoE, member?: Member[]) => {
  // メンバー全員の状態を取得
  member ??= await status.Fetch()

  // 凸宣言中のメンバー一覧を取得
  const declares = member.filter(m => m.declare === alpha)

  // 居ない場合は終了
  if (!declares.length) return

  // メンション一覧を作る
  const mentions = declares.map(m => `<@!${m.id}>`).join(' ')

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // 開放通知を行う
  channel.send(`${mentions} 開放！`)

  console.log('Release notice')
}
