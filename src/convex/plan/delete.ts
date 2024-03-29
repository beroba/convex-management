import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as declare from '../declare/list'
import * as role from '../role'
import * as situation from '../situation'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import * as util from '../../util'
import {Plan} from '../../util/type'

/**
 * 凸予定の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Already = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.CONVEX_RESERVATE
  if (!isChannel) return

  const isEmoji = react.emoji.id === Settings.EMOJI_ID.KANRYOU
  if (!isEmoji) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  await channel.messages.fetch(react.message.id)

  const member = await status.FetchMember(user.id)
  if (!member) return

  const msg = <Discord.Message>react.message

  const isAuthor = member?.id.find(n => n === msg.author.id)
  if (!isAuthor) return

  await react.message.delete()

  return 'Already completed message'
}

/**
 * 凸予定のメッセージを削除した際に完了処理を実行
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_RESERVATE
  if (!isChannel) return

  const isBot = msg.member?.user.bot
  if (isBot) return

  const [plans, plan] = await planDelete(msg)
  if (!plan) return

  situation.Plans(plans)
  situation.DeclarePlan(plan.alpha)

  declare.SetUser(plan.alpha)

  return 'Delete completed message'
}

/**
 * 引数で渡されたボス番号の凸予定一覧から、引数で渡されたユーザーidの後ろの凸予定を削除する
 * @parrm alpha ボス番号
 * @param id ユーザーid
 */
export const Remove = async (alpha: string, id: string) => {
  const plans = await schedule.FetchBoss(alpha)

  const plan = plans.reverse().find(p => p.playerID === id)
  if (!plan) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  const msg = await channel.messages.fetch(plan.msgID)

  await msg.delete()

  console.log('Delete completed message')
}

/**
 * 凸予定を削除する
 * @param msg DiscordからのMessage
 * @return [凸予定一覧, 削除した凸予定]
 */
const planDelete = async (msg: Discord.Message): Promise<[Plan[], Option<Plan>]> => {
  const [plans, plan] = await schedule.Delete(msg.id)
  if (!plan) return [plans, plan]

  await calMsgDel(plan.calID)
  await unroleBoss(plans, plan)

  return [plans, plan]
}

/**
 * 凸予定のメッセージを削除する
 */
const calMsgDel = async (id: string) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  const msg = await channel.messages
    .fetch(id)
    .then(m => m)
    .catch(_ => undefined)
  if (!msg) return

  console.log(msg.content)

  await msg.delete()
}

/**
 * 削除されたメッセージのボスのロールを外す
 * @param plans 凸予定一覧
 * @param plan 削除された凸予定
 */
const unroleBoss = async (plans: Plan[], plan: Plan) => {
  const find = plans.find(p => p.playerID === plan.playerID)
  if (find) return

  const guildMember = await util.MemberFromId(plan.playerID)
  await guildMember.roles.remove(Settings.BOSS_ROLE_ID[plan.alpha])
}

/**
 * 凸予定を全て削除する
 */
export const DeleteAll = async () => {
  await schedule.AllDelete()
  await msgAllRemove()

  const members = await status.Fetch()
  const guildMembers = await Promise.all(members.map(m => util.MemberFromId(m.id.first())))
  await Promise.all(guildMembers.map(async m => role.RemoveBossRole(m)))

  const plans = await schedule.Fetch()
  await situation.Plans(plans)

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全ての凸予定を削除したわ')

  console.log('reset all plan')
}

/**
 * 凸予定のメッセージを全て削除する
 */
const msgAllRemove = async () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  // メッセージを全て削除(100件)
  await channel.bulkDelete(100)
}
