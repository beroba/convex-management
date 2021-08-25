import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as situation from '../situation'
import * as json from '../../io/json'
import * as status from '../../io/status'
import * as util from '../../util'
import {User, Json} from '../../util/type'

/**
 * 同時凸の持越計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // 持越秒数を計算
  const a = overCalc(HP, A, B)
  const b = overCalc(HP, B, A)

  // 計算結果を出力
  msg.reply(`\`\`\`A ${a}s\nB ${b}s\`\`\`ダメージの高い方を先に通した方が持越時間が長くなるわよ！`)
}

/**
 * 持越の計算をする
 * 計算式: 持越時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a AのHP
 * @param b BのHP
 * @return 計算結果
 */
const overCalc = (HP: number, a: number, b: number): number => {
  return Math.ceil(90 - (((HP - a) * 90) / b - 20))
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
  // 全員の凸状況をリセット
  await status.ResetConvex()

  // メンバー全員の状態を取得
  const members = await status.Fetch()
  situation.Report(members)

  // bot-notifyに通知をする
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

  // ステータスを更新
  await status.UpdateUsers(users)

  // jsonの値を送信
  const list: Json = users.map(u => ({[u.id]: u.name})).reduce((a, b) => ({...a, ...b}))
  await json.Send(list)
}

/**
 * デイリーミッション消化の通知する
 */
export const NotifyDailyMission = () => {
  // 雑談に通知をする
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
export const Delete = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持越凸先でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CARRYOVER_DESTINATION) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CARRYOVER_DESTINATION)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  const msg = <Discord.Message>react.message
  if (msg.author.id !== user.id) return

  // メッセージを削除する
  react.message.delete()

  return "Delete my sister's completed message"
}

/**
 * 持越凸先のメッセージにルナの絵文字を付ける
 * @param msg DiscordからのMessage
 * @return 絵文字をつけたかの結果
 */
export const React = (msg: Discord.Message): Option<string> => {
  // #持越状況でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CARRYOVER_DESTINATION) return

  // ルナの絵文字をつける
  msg.react(Settings.EMOJI_ID.RUNA)

  return 'React Kanryou'
}
