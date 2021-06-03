import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import {AtoE, Current} from '../../io/type'
import * as list from '../plan/list'
import * as declaration from './declaration'
import * as status from './status'

/**
 * 凸宣言のボスを復活させる
 * @param alpha ボス番号
 * @param state 現在の状態
 */
export const RevivalBoss = async (alpha: AtoE, state: Current) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // ボスの状態を更新
  status.Update(alpha, state, channel)

  // 凸予定一覧を更新
  SetPlanList(alpha, state, channel)

  // 凸宣言のリアクションを全て外す
  await resetReact(alpha, channel)

  // 凸宣言をリセット
  declaration.SetUser(alpha, channel)

  // メッセージを削除
  messageDelete(channel)
}

/**
 * 凸予定一覧を更新する
 * @param alpha ボス番号
 * @param state 現在の状況
 * @param channel 凸宣言のチャンネル
 */
export const SetPlanList = async (alpha: AtoE, state?: Current, channel?: Discord.TextChannel) => {
  // 現在の状況を取得
  state ??= await current.Fetch()

  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // 凸予定のメッセージを取得
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].PLAN)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  const text = await list.CreatePlanText(alpha, state.stage, plans)

  // 凸予定一覧を更新
  // 1行目を取り除く
  msg.edit('凸予定\n' + text.split('\n').slice(1).join('\n'))
}

/**
 * 凸宣言に付いているリアクションを全て外す
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
const resetReact = async (alpha: AtoE, channel: Discord.TextChannel) => {
  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.DECLARE_MESSAGE_ID[alpha].DECLARE)

  // 凸宣言のリアクションを全て外す
  await msg.reactions.removeAll()

  // 凸宣言のリアクションを付ける
  await msg.react(Settings.EMOJI_ID.TOTU)
}

/**
 * 凸宣言のメッセージを削除する
 * @param channel 凸宣言のチャンネル
 */
const messageDelete = async (channel: Discord.TextChannel) => {
  // prettier-ignore
  // キャル以外のメッセージを全てを削除
  await Promise.all(
    (await channel.messages.fetch())
      .map(m => m)
      .filter(m => !m.author.bot)
      .map(async m => m.delete())
  )
}
