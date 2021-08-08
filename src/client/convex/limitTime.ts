import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as status from '../../io/status'
import {Member} from '../../io/type'

/**
 * 活動限界時間を設定する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @returns 活動限界時間設定の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 前半、後半のメッセージ以外は終了
  if (![Settings.TIME_LIMIT_EMOJI.FIRST, Settings.TIME_LIMIT_EMOJI.LATTER].some(id => id === react.message.id)) return

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ、リアクションを外して終了
  if (!member) {
    react.users.remove(user)
    return
  }

  // 活動限界時間の更新
  update(user.id)

  return 'Setting the activity limit time'
}

/**
 * 活動限界時間を設定する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @returns 活動限界時間設定の実行結果
 */
export const Remove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // 前半、後半のメッセージ以外は終了
  if (![Settings.TIME_LIMIT_EMOJI.FIRST, Settings.TIME_LIMIT_EMOJI.LATTER].some(id => id === react.message.id)) return

  // 活動限界時間の更新
  update(user.id)

  return 'Setting the activity limit time'
}

/**
 * 引数で渡したユーザーidの活動限界時間を設定する
 * @param id ユーザーid
 */
const update = async (id: string) => {
  // メンバーの状態を取得
  let member = await status.FetchMember(id)
  if (!member) return

  // 活動限界時間の設定
  member.limit = await fetchLimit(id)

  // ステータスを更新
  const members = await status.UpdateMember(member)

  // 活動限界時間の表示を更新
  Display(members)

  // 活動限界時間をスプレッドシートに反映
  status.ReflectOnLimit(member)
}

/**
 * 活動限界時間をリアクションから取得する
 * @param id ユーザーid
 * @returns 取得した時間
 */
const fetchLimit = async (id: string): Promise<string> => {
  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 前半と後半のメッセージを取得
  const first = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  const latter = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)

  // 前半の時間を取得
  const f = await Promise.all(
    first.reactions.cache
      .map(r => r)
      .filter(r => r.users.cache.map(u => u.id).some(u => u === id))
      .map(r => r.emoji.name?.replace('_', ''))
  )
  // 後半の時間を取得
  const l = await Promise.all(
    latter.reactions.cache
      .map(r => r)
      .filter(r => r.users.cache.map(u => u.id).some(u => u === id))
      .map(r => r.emoji.name?.replace('_', ''))
  )

  // 前半と後半を結合
  const list = f.concat(l)

  // 1番後ろの値を取得、なければ空
  return list.last() !== undefined ? <string>list.last() : ''
}

/**
 * 活動限界時間の表示を更新する
 * @param members メンバー一覧
 */
export const Display = async (members: Member[]) => {
  // 現在の時刻を取得
  const h = getHours()

  // 活動限界時間を迎えているメンバー一覧を取得
  const over = overMember(h, members)

  // 現在の時刻、次の時刻、その次の時刻が限界のメンバー一覧を取得
  const now = limitMember(h, members)
  const oneNext = limitMember(h + 1, members)
  const twoNext = limitMember(h + 2, members)

  // 活動限界時間のテキストを作成
  const text = [
    '活動限界時間',
    '```',
    `over: ${over}`,
    `${h % 24}: ${now}`,
    `${(h + 1) % 24}: ${oneNext}`,
    `${(h + 2) % 24}: ${twoNext}`,
    '```',
  ].join('\n')

  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 活動時間限界のメッセージを取得
  const msg = await channel.messages.fetch(Settings.TIME_LIMIT_EMOJI.DISPLAY)

  // メッセージを編集
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
  // 強制的にnumberにする
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
const overMember = (h: number, members: Member[]): string =>
  members
    .filter(m => {
      // 活動限界時間を設定していない人は終了
      if (m.limit === '') return false
      // 限界を超えているか確認
      return createTime(m.limit) < h
    })
    .filter(m => !m.end) // 3凸終了している人は省く
    .sort((a, b) => createTime(a.limit) - createTime(b.limit)) // 活動限界時間順に並び替える
    .map(m => `${m.name}[${m.limit}]`)
    .join(', ')

/**
 * 渡された時間が活動限界のメンバー一覧を取得する
 * @param h 確認する時間
 * @param members メンバー一覧
 * @returns 取得したメンバー一覧
 */
const limitMember = (h: number, members: Member[]): string =>
  members
    .filter(m => {
      // 活動限界時間を設定していない人は終了
      if (m.limit === '') return false
      // 同じ時間かか確認
      return createTime(m.limit) === h
    })
    .filter(m => !m.end) // 3凸終了している人は省く
    .map(m => `${m.name}`)
    .join(', ')
