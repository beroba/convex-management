import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as category from './category'
import * as dateTable from './dateTable'
import * as situation from './situation'
import * as json from '../io/json'
import * as status from '../io/status'
import * as util from '../util'
import {DateTable, User, Json, Member} from '../util/type'

/**
 * 同時凸の持越計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // prettier-ignore
  const text = [
    '```ts',
    `A: ${OverCalc(HP, A, B)}`,
    `B: ${OverCalc(HP, B, A)}`,
    '```'
  ].join('\n')
  msg.reply(text)
}

/**
 * 持越時間の計算をする
 * 計算式: 持越時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a 先に通すダメージ
 * @param b 後に通すダメージ
 * @return 持越秒数
 */
export const OverCalc = (HP: number, a: number, b: number): string => {
  const time = Math.ceil(90 - (((HP - a) * 90) / b - 20))
  return time >= 90 ? '90秒(フル)' : `${time}秒`
}

/**
 * メンバー全員の凸状況をリセットする
 */
export const ResetConvex = async () => {
  await status.ResetConvex()

  const members = await status.Fetch()
  await situation.Report(members)
  await situation.Boss(members)

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員の凸状況をリセットしたわ')

  console.log('Reset convex')
}

/**
 * botのクランメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
export const UpdateMembers = async (msg: Discord.Message): Promise<Member[]> => {
  // クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: [m.id],
      limit: '',
      declare: '',
      carry: false,
    }))
    .sort((a, b) => (a.id > b.id ? 1 : -1)) // ID順にソート
  if (!users) return []

  const members = await status.UpdateUsers(users)

  const list: Json = users.map(u => ({[u.id.first()]: u.name})).reduce((a, b) => ({...a, ...b}))
  await json.Send(list)

  return members
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
 * クランバトルに関連するする操作を行う
 */
export const ClanBattleOperation = () => {
  const date = dateTable.Create()
  const d = new Date()

  // クランバトルがある日の前日か確認
  {
    const day = `${d.getMonth() + 1}/${d.getDate() + 1}`
    const isDay = date.find(d => d.day === day)
    if (isDay) {
      return morningActivitySurvey(isDay)
    }
  }

  // クランバトル1日目の3日前か確認
  {
    const day = `${d.getMonth() + 1}/${d.getDate() + 3}`
    const isDay = date.find(d => d.day === day)
    if (isDay?.num === '1日目') {
      return preparingTrainingMode(d)
    }
  }

  // クランバトル5日目の1日後か確認
  {
    const day = `${d.getMonth() + 1}/${d.getDate() - 1}`
    const isDay = date.find(d => d.day === day)
    if (isDay?.num === '5日目') {
      return returnToDefault(d)
    }
  }
}

/**
 * 朝活アンケートを通知する
 */
const morningActivitySurvey = async (isDay: DateTable) => {
  const text = [
    `<@&${Settings.ROLE_ID.CLAN_MEMBERS}>`,
    `\`${isDay.day}\` クラバト${isDay.num}の朝活アンケートです`,
    `朝活に参加する予定の方は、${Settings.EMOJI_FULL_ID.SANKA} を押して下さい`,
  ].join('\n')

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CLAN_BATTLE_CONTACT)
  const msg = await channel.send(text)
  await msg.react(Settings.EMOJI_ID.SANKA)

  console.log('Take a morning activity questionnaire')
}

/**
 * クランバトルのカテゴリーを作成する
 */
const preparingTrainingMode = async (d: Date) => {
  const guild = util.GetGuild()
  if (!guild) return

  // カテゴリーの作成と並び替え
  const [year, month] = [d.getFullYear(), d.getMonth() + 1]
  await category.Create(year, month, guild)
  await util.Sleep(1000)
  await category.SetClanBattle(year, month, guild)

  const title = category.CreateTitle(year, month)

  // クラバト連絡に通知
  {
    const text = [
      `<@&${Settings.ROLE_ID.CLAN_MEMBERS}>`,
      `トレーニングモードが始まったわよ！`,
      `編成やTLは \`${title}\` に書き込んでね`,
      `\`例: 12-a, 12段階目の1ボス\` ※チャンネル名は後ほど修正されます`,
    ].join('\n')
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.CLAN_BATTLE_CONTACT)
    const msg = await channel.send(text)
    await msg.react(Settings.EMOJI_ID.KAKUNIN)
  }

  // bot-notifyに通知
  {
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
    await channel.send(`${title}のカテゴリーを作成したわよ！`)
  }

  console.log('Prepare and set up training')
}

/**
 * クランバトルのカテゴリーを元の位置に戻す
 */
const returnToDefault = async (d: Date) => {
  // カテゴリーの作成と並び替え
  const [year, month] = [d.getFullYear(), d.getMonth() + 1]
  await category.SetDefault(year, month)

  console.log('Return category to its original position')
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

  await react.message.delete()

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
