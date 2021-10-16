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
  const isBot = msg.member?.user.bot
  if (isBot) return

  // チャンネルのボス番号を取得
  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === msg.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  msg.member?.roles.remove(Settings.ROLE_ID.ATTENDANCE)

  let content = util.Format(msg.content)

  // @とsが両方ある場合は@を消す
  content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content

  const isKill = content === 'kill'
  if (isKill) {
    content = '@0'
  }

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    await status.RemainingHPChange(content, alpha)
    msg.delete()

    return 'Remaining HP change'
  }

  msg.react(Settings.EMOJI_ID.TOOSHI)
  msg.react(Settings.EMOJI_ID.MOCHIKOSHI)
  msg.react(Settings.EMOJI_ID.TAIKI)

  await status.Update(alpha)

  return 'Calculate the HP React'
}

/**
 * 指定されたボスを次の周へ進める
 * @param alpha ボス番号
 * @param state 現在の状態
 */
export const NextBoss = async (alpha: AtoE, state: Current) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  await status.Update(alpha, state, channel)
  await list.SetPlan(alpha, state, channel)

  const members = await undeclare(alpha)

  await list.SetUser(alpha, channel, members)
  await messageDelete(channel)
}

/**
 * 指定されたボスの凸宣言を全て解除する
 * @param alpha ボス番号
 * @returns メンバー全体の状態
 */
const undeclare = async (alpha: AtoE): Promise<Member[]> => {
  let members = await member.Fetch()

  members = members.map(m => {
    if (m.declare === alpha) {
      m.declare = ''
    }
    return m
  })

  await member.Update(members)

  return members
}

/**
 * 凸宣言のメッセージを削除する
 * @param channel 凸宣言のチャンネル
 */
const messageDelete = async (channel: Discord.TextChannel) => {
  const msgs = await channel.messages.fetch()

  await Promise.all(
    msgs
      .map(m => m)
      .filter(m => !m.author.bot)
      .map(async m => {
        if (!m) return
        await m.delete()
      })
  )
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param member メンバーの状態
 * @param user リアクションを外すユーザー
 */
export const Done = async (alpha: AtoE, user: Discord.User) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  list.SetUser(alpha, channel)

  const msgs = (await channel.messages.fetch()).map(m => m)

  // 凸宣言完了者のキャルの返信を全て削除
  msgs
    .filter(m => m.author.id === Settings.CAL_ID)
    .filter(m => RegExp(user.id).test(m.content))
    .forEach(m => {
      if (!m) return
      m.delete()
    })

  console.log('Completion of convex declaration')
}
