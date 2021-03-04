import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {Current} from '../../io/type'

/**
 * 凸宣言にリアクションしているユーザーから凸宣言一覧を作る
 * @param state 現在の状況
 */
export const SetUser = async (state: Option<Current>) => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 凸宣言に付いているリアクションをキャッシュする
  await Promise.all(declare.reactions.cache.map(async r => await r.users.fetch()))

  // 本戦、保険に分けてリアクションしている人一覧を取得する
  const emoji = declare.reactions.cache.map(r => ({name: r.emoji.name, users: r.users.cache.map(u => u)}))

  // prettier-ignore
  /**
   * emojiから本戦と保険で分離する
   * @param name honsenかhoken
   */
  const separatMember = async (name: string) =>
    (await Promise.all(
      emoji.filter(e => e.name === name)[0]
        .users
        .map(u => status.FetchMember(u.id)))
    ).filter(m => m)

  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(state?.alpha || '')

  // 本戦の凸宣言者一覧を作成
  const honsen = (await separatMember('honsen')).map(m => {
    const p = plans.find(p => p.playerID === m?.id)
    return `${m?.name}@${m?.convex ? m?.convex : '0'}${m?.over ? '+' : ''}${p ? ` ${p.msg}` : ''}`
  })
  const hoken = (await separatMember('hoken')).map(m => {
    const p = plans.find(p => p.playerID === m?.id)
    return `${m?.name}@${m?.convex ? m?.convex : '0'}${m?.over ? '+' : ''}(保険) ${p ? ` ${p.msg}` : ''}`
  })

  // 2つの凸宣言を結合
  const convex = honsen.concat(hoken)

  // 凸宣言のメッセージを編集
  declare.edit(`凸宣言\n\`\`\`\n${convex.length ? convex.join('\n') : ' '}\n\`\`\``)
}

/**
 * 凸宣言に付いているリアクションを全て外す
 */
export const ResetReact = async () => {
  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 凸宣言のリアクションを全て外す
  await declare.reactions.removeAll()

  // 本戦と保険のリアクションを付ける
  await declare.react(Settings.EMOJI_ID.HONSEN)
  await declare.react(Settings.EMOJI_ID.HOKEN)
}
