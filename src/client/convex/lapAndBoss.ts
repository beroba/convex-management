import * as Discord from 'discord.js'
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
 * @return 現在の状況
 */
export const UpdateLap = async (lap: number, state?: Current): Promise<Current> => {
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
    await stageReport(st)

    // 現在の状況をスプレッドシートに反映
    current.ReflectOnSheet(st)

    return st
  })

  return st
}

/**
 * ボスのHPを変更する
 * @param hp 変更先のHP
 * @param alpha ボス番号
 * @param state 現在の状況
 * @return 現在の状況
 */
export const UpdateBoss = async (hp: number, alpha: AtoE, state?: Current): Promise<Current> => {
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 現在の状況を更新
  let st = await current.UpdateBoss(hp, alpha, state)
  await util.Sleep(100)

  // ボスが討伐されているか確認
  if (st[alpha].subjugate) {
    // 討伐通知を送信
    await subjugateReport(alpha, st)

    // 開放通知を送信
    await releaseNotice(alpha)

    // 討伐メッセージを送信
    await subjugateSend(alpha)
  } else {
    // 討伐メッセージを削除
    await SubjugateDelete(alpha)
  }

  // 全てのボスが討伐済みの場合
  if ('abcde'.split('').every(a => st[a as AtoE].subjugate)) {
    // 周回数を1つ進める
    UpdateLap(st.lap + 1)
  }

  // 現在の状況をスプレッドシートに反映
  current.ReflectOnSheet(st)

  return st
}

/**
 * #進行に現在の周回数を報告
 * @param state 現在の状況
 */
const stageReport = async (state: Current) => {
  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(`<@&${Settings.ROLE_ID.PLAN_CONVEX}> \`${state.lap}\`周目`)
}

/**
 * #進行-連携に討伐したボスを報告
 * @param alpha ボス番号
 * @param state 現在の状況
 */
const subjugateReport = async (alpha: AtoE, state: Current) => {
  // 進行に報告
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  await channel.send(`\`${state.lap}\`周目 \`${state[alpha].name}\` 討伐`)
}

/**
 * #進行-連携に開放通知を行う
 * @param alpha ボス番号
 * @param member クランメンバー一覧
 */
const releaseNotice = async (alpha: AtoE, member?: Member[]) => {
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

/**
 * 討伐されたボスに討伐メッセージを送信する
 * @param alpha ボス番号
 */
const subjugateSend = async (alpha: AtoE) => {
  // 凸宣言のチャンネルを取得
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // 討伐のメッセージを送信
  const msg = await channel.send('討伐')

  // 済のリアクションを付ける
  msg.react(Settings.EMOJI_ID.SUMI)
}

/**
 * 復活したボスに討伐メッセージがある場合削除する
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const SubjugateDelete = async (alpha: AtoE, channel?: Discord.TextChannel) => {
  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // メッセージを全て取得
  const msgs = await channel.messages.fetch()

  // 済が付いてるbotのメッセージを削除
  msgs
    .map(m => m)
    .filter(m => m.author.bot)
    .map(m => {
      const sumi = m.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI)
      if (!sumi) return
      m.delete()
    })
}
