import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import {Plan} from '../../io/type'
import * as list from './list'

/**
 * 凸予定の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Already = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸予定でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.KANRYOU) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // 凸予定のメッセージを削除する
  react.message.delete()

  return 'Already completed message'
}

/**
 * 凸予定のメッセージを削除した際に完了処理を実行
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // 凸予定を削除
  const plans = await planDelete(msg)

  // 凸状況を更新
  await list.SituationEdit(plans)

  return 'Delete completed message'
}

/**
 * 引数で渡されたボス番号の凸予定一覧から、引数で渡されたユーザーidの先頭の凸予定を削除する
 * @parrm alpha ボス番号
 * @param id ユーザーid
 */
export const Remove = async (alpha: string, id: string) => {
  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(alpha)

  // 一致する凸予定がない場合は終了
  const plan = plans.find(p => p.playerID === id)
  if (!plan) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  const msg = await channel.messages.fetch(plan.senderID)

  // 凸予定のメッセージを削除する
  msg.delete()

  console.log('Delete completed message')
}

/**
 * 引数で渡されたユーザーidの凸予定を全て完了する
 * @param id ユーザーid
 */
export const AllRemove = async (id: string) => {
  // 凸予定の全メッセージを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  const msgs = await channel.messages.fetch()

  // 凸予定の中からユーザーidの物だけに選別
  const list = msgs.map(v => v).filter(m => m.author.id === id)

  // 3秒起きに削除を実行
  for (const m of list) {
    m.delete()
    await util.Sleep(3000)
  }

  // 残ってる凸予定を削除
  const plans = await schedule.Fetch()
  Promise.all(plans.filter(p => p.playerID === id).map(async p => await schedule.Delete(p.senderID)))

  console.log('Delete all convex schedules')
}

/**
 * 凸予定を削除する
 * @param msg DiscordからのMessage
 * @return 凸予定一覧
 */
const planDelete = async (msg: Discord.Message): Promise<Plan[]> => {
  // 凸予定の完了を付ける
  const [plans, plan] = await schedule.Delete(msg.id)
  if (!plan) return plans
  await util.Sleep(50)

  // メッセージを削除
  await calMsgDel(plan.calID)

  // ボスのロールを外す
  await unroleBoss(plans, plan, msg)

  return plans
}

/**
 * 凸予定のメッセージを削除する
 * @param id 削除するメッセージid
 */
const calMsgDel = async (id: string) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  // メッセージをキャッシュする
  const msg = await channel.messages
    .fetch(id)
    .then(m => m)
    .catch(_ => undefined)

  // メッセージが既にない場合は終了
  if (!msg) return

  // メッセージを削除する
  msg.delete()
}

/**
 * 削除されたメッセージのボスのロールを外す
 * @param plan 削除されたPlanの値
 * @param msg DiscordからのMessage
 */
const unroleBoss = async (plans: Plan[], plan: Plan, msg: Discord.Message) => {
  // 他に同じボスの凸予定がある場合は終了
  const find = plans.filter(p => p.alpha === plan.alpha).find(p => p.playerID === plan.playerID)
  if (find) return

  // ボス番号のロールを削除
  await msg.member?.roles.remove(Settings.BOSS_ROLE_ID[plan.alpha])
}
