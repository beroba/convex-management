import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as situation from './situation'
import * as json from '../io/json'
import * as status from '../io/status'
import * as util from '../util'
import {User, Json} from '../util/type'

/**
 * 同時凸の持越計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // 持越秒数を計算
  const a = OverCalc(HP, A, B)
  const b = OverCalc(HP, B, A)

  // prettier-ignore
  const text = [
    '```m',
    `A: ${a >= 90 ? '90秒(フル)' : a + '秒'}`,
    `B: ${b >= 90 ? '90秒(フル)' : b + '秒'}`,
    '```',
  ].join('\n')
  msg.reply(text)
}

/**
 * 持越の計算をする
 * 計算式: 持越時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a AのHP
 * @param b BのHP
 * @return 計算結果
 */
export const OverCalc = (HP: number, a: number, b: number): number => {
  return Math.ceil(90 - (((HP - a) * 90) / b - 20))
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
  await status.ResetConvex()

  const members = await status.Fetch()
  situation.Report(members)

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員の凸状況をリセットしたわ')

  console.log('Reset convex')
}

/**
 * botのクランメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
export const UpdateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
      limit: '',
      declare: '',
      carry: false,
    }))
    .sort((a, b) => (a.id > b.id ? 1 : -1)) // ID順にソート
  if (!users) return

  await status.UpdateUsers(users)

  const list: Json = users.map(u => ({[u.id]: u.name})).reduce((a, b) => ({...a, ...b}))
  await json.Send(list)
}

/**
 * 特定のリアクションを先にキャッシュする
 */
export const Fetch = async () => {
  // 全ボス分[a-e]
  await Promise.all(
    'abcde'.split('').map(async alpha => {
      const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
      const msgs = await channel.messages.fetch()

      // prettier-ignore
      // ダメージ報告に付いているリアクションをキャッシュ
      await Promise.all(
        msgs.map(async msg => Promise.all(
          msg.reactions.cache.map(async r =>  r.users.fetch())
        ))
      )
    })
  )
}

/**
 * デイリーミッション消化の通知する
 */
export const NotifyDailyMission = () => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)
  channel.send('もう4:30よ！デイリーミッションは消化したわよね！！してなかったらぶっ殺すわよ！！！！')

  console.log('Notify daily mission digestion')
}

/**
 * 持越凸先の自分のメッセージに絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const SisterReactDelete = async (
  react: Discord.MessageReaction,
  user: Discord.User
): Promise<Option<string>> => {
  const isBot = user.bot
  if (isBot) return

  const isChannel = react.message.channel.id === Settings.CHANNEL_ID.CARRYOVER_DESTINATION
  if (!isChannel) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_DESTINATION)
  await channel.messages.fetch(react.message.id)

  const msg = <Discord.Message>react.message
  if (msg.author.id !== user.id) return

  react.message.delete()

  return "Delete my sister's completed message"
}

/**
 * 持越凸先のメッセージにルナの絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const SisterReactAdd = (msg: Discord.Message): Option<string> => {
  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CARRYOVER_DESTINATION
  if (!isChannel) return

  msg.react(Settings.EMOJI_ID.RUNA)

  return 'React Runa'
}
