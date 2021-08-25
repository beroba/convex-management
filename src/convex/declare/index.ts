import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as list from './list'
import * as status from './status'
import * as member from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Member} from '../../util/type'

/**
 * 凸宣言の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸管理の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === msg.channel.id
  ) as Option<AtoE>

  // ボス番号がなければ凸宣言のチャンネルでないので終了
  if (!alpha) return

  // 離席中ロールを削除
  msg.member?.roles.remove(Settings.ROLE_ID.AWAY_IN)

  // 全角を半角に変換
  let content = util.Format(msg.content)
  // @とsが両方ある場合は@を消す
  content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content

  // killの場合はHPを0にする
  if (content === 'kill') {
    content = '@0'
  }

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    // ボスのHP変更
    await status.RemainingHPChange(content, alpha)

    // メッセージの削除
    msg.delete()

    return 'Remaining HP change'
  }

  // 通しと持越と待機の絵文字を付ける
  msg.react(Settings.EMOJI_ID.TOOSHI)
  msg.react(Settings.EMOJI_ID.MOCHIKOSHI)
  msg.react(Settings.EMOJI_ID.TAIKI)

  // 予想残りHPの更新
  await status.Update(alpha)

  return 'Calculate the HP React'
}

/**
 * 指定されたボスを次の周へ進める
 * @param alpha ボス番号
 * @param state 現在の状態
 */
export const NextBoss = async (alpha: AtoE, state: Current) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  // ボスの状態を更新
  await status.Update(alpha, state, channel)

  // 凸予定一覧を更新
  await list.SetPlan(alpha, state, channel)

  // 凸宣言のリアクションを全て外す
  await resetReact(alpha, channel)

  // 指定されたボスの凸宣言を全て解除
  const members = await undeclare(alpha)

  // 凸宣言をリセット
  await list.SetUser(alpha, channel, members)

  // メッセージを削除
  await messageDelete(channel)
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
  await msg.react(Settings.EMOJI_ID.MOCHIKOSHI)
}

/**
 * 指定されたボスの凸宣言を全て解除する
 * @param alpha ボス番号
 * @returns メンバー全体の状態
 */
const undeclare = async (alpha: AtoE): Promise<Member[]> => {
  // メンバー全体の状態を取得
  let members = await member.Fetch()

  // 凸宣言を全て解除
  members = members.map(m => {
    if (m.declare === alpha) {
      m.declare = ''
    }
    return m
  })

  // メンバーの状態を更新
  await member.Update(members)

  return members
}

/**
 * 凸宣言のメッセージを削除する
 * @param channel 凸宣言のチャンネル
 */
const messageDelete = async (channel: Discord.TextChannel) => {
  // メッセージを全て取得
  const msgs = await channel.messages.fetch()

  // キャル以外のメッセージを全て削除
  await Promise.all(
    msgs
      .map(m => m)
      .filter(m => !m.author.bot)
      .map(async m => m.delete())
  )
}