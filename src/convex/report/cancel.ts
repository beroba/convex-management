import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as lapAndBoss from '../lapAndBoss'
import * as situation from '../situation'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Member} from '../../util/type'

/**
 * 凸報告を取り消す
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 取り消し処理の実行結果
 */
export const Cancel = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.CONVEX_REPORT
  if (!isChannel) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.TORIKESHI
  if (!isEmoji) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_REPORT)
  await channel.messages.fetch(react.message.id)

  const msg = <Discord.Message>react.message

  const isAuthor = msg.author.id === user.id
  if (!isAuthor) return

  const member = await status.FetchMember(msg.author.id)
  if (!member) return

  const members = await statusRestore(msg, member)
  if (!members) return

  await killConfirm(member.history)
  situation.Report(members)

  return 'Convex cancellation'
}

/**
 * 凸報告を取り消す
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_REPORT
  if (!isChannel) return

  const member = await status.FetchMember(msg.author.id)
  if (!member) return

  const members = await statusRestore(msg, member)
  if (!members) return

  await killConfirm(member.history)
  situation.Report(members)

  return 'Convex cancellation'
}

/**
 * 凸状況を元に戻す
 * @param DiscordからのMessage
 * @param member 変更するメンバーの状態
 * @return メンバー一覧
 */
const statusRestore = async (msg: Discord.Message, member: Member): Promise<Option<Member[]>> => {
  const result = confirmCancelTwice(member)
  if (result) return

  member = rollback(member)

  if (member.end) {
    member = endConfirm(member, msg)
  }

  // prettier-ignore
  const text = [
    '取消を行ったわよ',
    'ボスのHPや周回数が合っているか確認してね！',
    'HPが間違っている場合は`/@{HP}`、周回数が間違っている場合は進行役に連絡してね',
    '```',
    `残凸数: ${member.convex}、持越数: ${member.over}`,
    '```',
  ].join('\n')
  msg.reply(text)

  const members = await status.UpdateMember(member)

  return members
}

/**
 * 2回キャンセルしてないか確認
 * @param member 確認するメンバー
 * @return 2回キャンセルしていたかの真偽値
 */
const confirmCancelTwice = (member: Member): boolean => {
  return `${member.convex}${'+'.repeat(member.over)}` === member.history.split('|').first()
}

/**
 * 凸状況を1つ前に戻す
 * @param member 更新するメンバー
 * @return 更新したメンバー
 */
const rollback = (member: Member): Member => {
  const history = member.history.split('|').first()
  member.convex = history[0].to_n()
  member.over = history.match(/\+/g) ? <number>history.match(/\+/g)?.length : 0
  return member
}

/**
 * 3凸目の取消の場合に凸残ロールを付与する
 * @param member 更新するメンバー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
const endConfirm = (member: Member, msg: Discord.Message): Member => {
  member.end = false
  msg.member?.roles.add(Settings.ROLE_ID.REMAIN_CONVEX)

  return member
}

/**
 * ボスを倒していた場合、前のボスに戻す
 * @param history 凸報告の履歴
 */
const killConfirm = async (history: string) => {
  const content = history.split('|').slice(1).join('')

  const isKill = /^k|kill|き(っ|l)l/i.test(content)
  if (!isKill) return

  const state = await current.Fetch()
  const alpha = <AtoE>content[0]
  const lap = state[alpha].lap

  lapAndBoss.UpdateLap(lap - 1, alpha)
}
