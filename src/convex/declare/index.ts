import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as list from './list'
import * as status from './status'
import * as situation from '../situation'
import * as attendance from '../role/attendance'
import * as damageList from '../../io/damageList'
import * as member from '../../io/status'
import * as util from '../../util'
import {AtoE, Current, Damage, Member} from '../../util/type'

/**
 * 凸宣言の管理を行う。
 * ダメージ報告やコマンド入力
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

  await status.Process(msg, alpha)

  const m = await member.FetchMember(msg.author.id)
  if (!m) return

  await attendance.Remove(m.id.first())
  situation.Plans()

  return 'Report damage or execute command'
}

/**
 * 指定されたボスを次の周へ進める
 * @param alpha ボス番号
 * @param state 現在の状態
 */
export const NextBoss = async (alpha: AtoE, state: Current) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  await situation.DeclarePlan(alpha, state, channel)

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
    .filter(Boolean)
  for (const m of msgs) {
    await util.Sleep(100)
    m.delete()
  }
}

/**
 * 渡されたユーザーの凸宣言を完了する
 * @param alpha ボス番号
 * @param member メンバーの状態
 */
export const Done = async (alpha: AtoE, member: Member) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel)

  let damages = await damageList.FetchBoss(alpha)
  const damage = damages.find(d => member.id.find(n => n === d.id))

  // ダメージにチェックを付ける。ない場合は追加
  if (damage) {
    damages = damages.map(d => {
      if (!member.id.find(n => n === d.id)) return d
      d.exclusion = true
      d.flag = 'check'
      d.already = true
      return d
    })
  } else {
    const damage: Damage = {
      name: member.name,
      id: member.id.first(),
      num: '0',
      exclusion: true,
      flag: 'check',
      text: '',
      damage: 0,
      time: 0,
      date: util.GetCurrentDate(),
      already: true,
    }
    damages = [...damages, damage]
  }

  damages = await damageList.UpdateBoss(alpha, damages)
  await list.SetDamage(alpha, undefined, channel, damages)

  // 通し通知を削除
  const msgs = (await channel.messages.fetch())
    .map(m => m)
    .filter(m => m.author.id === Settings.CAL_ID)
    .filter(m => m.reactions.cache.map(r => r).find(r => r.emoji.id === Settings.EMOJI_ID.SUMI))
    .filter(m => new RegExp(member.id.first(), 'g').test(m.content))
    .filter(Boolean)
  for (const m of msgs) {
    await util.Sleep(100)
    m.delete()
  }

  console.log('Completion of convex declaration')
}

/**
 * 済が付いているキャルのメッセージにリアクションしたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Sumi = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.SUMI
  if (!isEmoji) return

  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === react.message.channel.id
  ) as Option<AtoE>
  if (!alpha) return

  await react.message.channel.messages.fetch(react.message.id)

  const msg = <Discord.Message>react.message
  if (msg.author.id !== Settings.CAL_ID) return

  // キャルともう1人がリアクションしていない場合
  if (react.count < 2) {
    await react.remove()
    return
  }

  react.message.delete()

  return 'Delete completed message'
}
