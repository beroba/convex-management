import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {Plan, AtoE} from '../../io/type'

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
export const SetUser = async (alpha: AtoE, channel?: Discord.TextChannel) => {
  // 凸宣言のチャンネルを取得
  channel ??= util.GetTextChannel(Settings.CONVEX_DECLARE[alpha].CHANNEL)

  // 凸宣言のメッセージを取得
  const msg = await channel.messages.fetch(Settings.CONVEX_DECLARE[alpha].DECLARE)

  // 凸宣言に付いているリアクションをキャッシュ
  await Promise.all(msg.reactions.cache.map(async r => await r.users.fetch()))
  await util.Sleep(100)

  // リアクションしている人一覧を取得する
  const emoji: Emoji[] = msg.reactions.cache.map(r => ({name: r.emoji.name, users: r.users.cache.map(u => u)}))

  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(alpha)

  // 凸宣言者一覧を作成
  const list = await createDeclareList(plans, emoji)

  // 凸宣言のメッセージを作成
  const text = [
    '凸宣言 `[現在の凸数(+は持越), 活動限界時間]`',
    '```',
    `${list.join('\n')}${list.length ? '' : ' '}`,
    '```',
  ].join('\n')

  // 凸宣言のメッセージを編集
  msg.edit(text)
}

/**
 * 凸宣言一覧のリストを作成する
 * @param plans 凸予定一覧
 * @param emoji 絵文字のリスト
 * @return 作成したリスト
 */
const createDeclareList = async (plans: Plan[], emoji: Emoji[]): Promise<string[]> => {
  const convex = (
    await Promise.all(
      emoji
        .filter(e => e.name === 'totu')
        .first()
        .users.map(async u => await status.FetchMember(u.id))
    )
  ).filter(m => m)

  // テキストを作成
  return convex.map(m => {
    const p = plans.find(p => p.playerID === m?.id)

    const convex = m?.convex ? m?.convex : '0'
    const over = m?.over ? '+' : ''
    const limit = m?.limit !== '' ? `, ${m?.limit}時` : ''
    return `${m?.name}[${convex}${over}${limit}]${p ? ` ${p.msg}` : ''}`
  })
}
