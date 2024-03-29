import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../io/status'
import * as util from '../util'
import {Member} from '../util/type'

/**
 * 選択された情報に応じて活動限界時間を更新する
 * @param interaction インタラクションの情報
 * @return 活動限界時間更新の実行結果
 */
export const Interaction = async (interaction: Discord.Interaction): Promise<Option<string>> => {
  const isBot = interaction.user.bot
  if (isBot) return

  if (!interaction.isSelectMenu()) return

  const isId = interaction.customId === 'time-limit'
  if (!isId) return

  const user = interaction.user
  const member = await status.FetchMember(user.id)
  if (!member) return

  member.limit = interaction.values.first()

  const members = await status.UpdateMember(member)
  Display(members)

  const content = `${member.limit}時`
  interaction.reply({content: content, ephemeral: true})

  return
}

/**
 * 活動限界時間の表示を更新する
 * @param members メンバー一覧
 */
export const Display = async (members: Member[]) => {
  // 名前順にソート
  members = members.sort((a, b) => (a.name > b.name ? 1 : -1))

  const h = getHours()
  const over = overMember(h, members)

  const now = limitMember(h, members)
  const oneNext = limitMember(h + 1, members)
  const twoNext = limitMember(h + 2, members)

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_OPERATION)
  const msg = await channel.messages.fetch(Settings.BOT_OPERATION.TIME_LIMIT)

  const text = [
    '活動限界時間の変更',
    '```',
    `over: ${over}`,
    `${h % 24}: ${now}`,
    `${(h + 1) % 24}: ${oneNext}`,
    `${(h + 2) % 24}: ${twoNext}`,
    '```',
  ].join('\n')
  msg.edit(text)

  console.log('Updated activity time limit display')
}

/**
 * 現在の時間を取得する
 * @returns 時間
 */
const getHours = (): number => {
  const h = new Date().getHours()
  return createTime(h)
}

/**
 * 受け取った時間が5未満なら+24して返す
 * @param num 時間
 * @returns 作成した時間
 */
const createTime = (num: number | string): number => {
  const n = Number(num)
  // 5未満は+24する
  return n < 5 ? n + 24 : n
}

/**
 * 活動限界時間を迎えているメンバー一覧を取得する
 * @param h 活動限界時間
 * @param members メンバー一覧
 * @returns 取得したメンバー一覧
 */
const overMember = (h: number, members: Member[]): string => {
  return members
    .filter(m => {
      if (m.limit === '') return false
      return createTime(m.limit) < h
    })
    .filter(m => !m.end) // 3凸終了している人は省く
    .sort((a, b) => createTime(a.limit) - createTime(b.limit)) // 活動限界時間順に並び替える
    .map(m => `${m.name}[${m.limit}]`)
    .join(', ')
}

/**
 * 渡された時間が活動限界のメンバー一覧を取得する
 * @param h 確認する時間
 * @param members メンバー一覧
 * @returns 取得したメンバー一覧
 */
const limitMember = (h: number, members: Member[]): string => {
  return members
    .filter(m => {
      if (m.limit === '') return false
      return createTime(m.limit) === h
    })
    .filter(m => !m.end) // 3凸終了している人は省く
    .map(m => m.name)
    .join(', ')
}

/**
 * 活動限界時間を1時間起きに更新する
 */
export const LimitTimeDisplay = async () => {
  const members = await status.Fetch()

  Display(members)

  const date = new Date().getHours().to_s()

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send(`${date}時の活動限界時間を更新したわ`)

  console.log('Periodic update of activity time limit display')
}
