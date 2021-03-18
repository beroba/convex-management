import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {Current, Plan} from '../../io/type'

/**
 * 絵文字の名前とユーザー一覧
 */
type Emoji = {
  name: string
  users: Discord.User[]
}

/**
 * 凸宣言にリアクションしているユーザーから凸宣言一覧を作る
 * @param state 現在の状況
 */
export const SetUser = async (state: Current) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 本戦、保険に分けてリアクションしている人一覧を取得する
  const emoji: Emoji[] = msg.reactions.cache.map(r => ({name: r.emoji.name, users: r.users.cache.map(u => u)}))

  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(state.alpha)

  // 本戦の凸宣言者一覧を作成
  const honsen = await createDeclareList(plans, emoji, 'honsen')
  const hoken = await createDeclareList(plans, emoji, 'hoken')

  // 凸宣言のメッセージを作成
  const text = [
    '凸宣言 `[現在の凸数(+は持越), 活動限界時間]`',
    '```',
    '――――本戦――――',
    `${honsen.join('\n')}${honsen.length ? '\n' : ''}`,
    '――――保険――――',
    `${hoken.join('\n')}`,
    '```',
  ].join('\n')

  // 凸宣言のメッセージを編集
  msg.edit(text)
}

/**
 * 凸宣言一覧のリストを作成する
 * @param plans 凸予定一覧
 * @param emoji 絵文字のリスト
 * @param name honsenかhoken
 * @return 作成したリスト
 */
const createDeclareList = async (plans: Plan[], emoji: Emoji[], name: string): Promise<string[]> => {
  // prettier-ignore
  const convex = (await Promise.all(
    emoji.filter(e => e.name === name)[0]
      .users
      .map(u => status.FetchMember(u.id)))
    ).filter(m => m)

  // テキストを作成
  return convex.map(m => {
    const p = plans.find(p => p.playerID === m?.id)
    return `${m?.name}[${m?.convex ? m?.convex : '0'}${m?.over ? '+' : ''}${m?.limit !== '' ? `, ${m?.limit}時` : ''}]${
      p ? ` ${p.msg}` : ''
    }`
  })
}

/**
 * 凸宣言に付いているリアクションを全て外す
 */
export const ResetReact = async () => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 凸宣言のリアクションを全て外す
  await msg.reactions.removeAll()

  // 本戦と保険のリアクションを付ける
  await msg.react(Settings.EMOJI_ID.HONSEN)
  await msg.react(Settings.EMOJI_ID.HOKEN)
}
