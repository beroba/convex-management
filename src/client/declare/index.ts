import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import {Current, AtoE} from '../../io/type'
import * as list from '../plan/list'
import * as declaration from './declaration'
import * as status from './status'

/**
 * 凸宣言のボスを変更する
 * @param state 現在の状態
 * @param alpha ボス番号
 */
export const RevivalBoss = async (state: Current, alpha: AtoE) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CONVEX_DECLARE[alpha].CHANNEL)

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
  channel ??= util.GetTextChannel(Settings.CONVEX_DECLARE[alpha].CHANNEL)

  // 凸予定のメッセージを取得
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.PLAN)

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
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE[alpha].DECLARE)

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
  const list = await Promise.all(
    (await channel.messages.fetch())
      .map(m => m)
      .filter(m => !m.author.bot)
      .map(m => m.delete())
  )

  // 済が付いていないメッセージのユーザー一覧のリストを作成
  const users = list
    .filter(m => !m.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI))
    .map(m => m.author)

  // 削除したメッセージがない場合は終了
  if (!users.length) return

  // 開放通知を行う
  releaseNotice(users)
}

/**
 * #進行-連携に開放通知を行う
 * @param users メンションを行うユーザー一覧
 */
const releaseNotice = (users: Discord.User[]) => {
  // 重複を省いたメンション一覧を作成する
  const mentions = users
    .filter((n, i, e) => e.indexOf(n) == i)
    .map(u => `<@!${u.id}>`)
    .join(' ')

  // #進行-連携のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)

  // メンションを行う
  channel.send(`${mentions} ボスが討伐されたから通して大丈夫よ！`)

  console.log('Release notice')
}
