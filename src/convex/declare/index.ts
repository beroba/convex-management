import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as list from './list'
import * as status from './status'
import * as damageList from '../../io/damageList'
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

  await status.Process(msg, alpha)

  return 'Calculate the HP React'
}

/**
 * 指定されたボスを次の周へ進める
 * @param alpha ボス番号
 * @param state 現在の状態
 */
export const NextBoss = async (alpha: AtoE, state: Current) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  await list.SetPlan(alpha, state, channel)

  const members = await undeclare(alpha)

  await list.SetUser(alpha, channel, members)

  const damages = await damageList.DeleteBoss(alpha)
  await list.SetDamage(alpha, state, channel, damages)

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
    if (new RegExp(alpha, 'gi').test(m.declare)) {
      m.declare = m.declare.replace(alpha, '')
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
  // sumiの付いているメッセージを全て削除
  const msgs = (await channel.messages.fetch())
    .map(m => m)
    .filter(m => m.author.id === Settings.CAL_ID)
    .filter(m => m.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI))
    .filter(m => m)
  for (const m of msgs) {
    await util.Sleep(100)
    m.delete()
  }
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param member メンバーの状態
 * @param user リアクションを外すユーザー
 */
export const Done = async (alpha: AtoE) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel)

  console.log('Completion of convex declaration')
}
