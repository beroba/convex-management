import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as members from '../../io/members'
import * as util from '../../util'

/**
 * 凸数と持ち越し
 */
type State = {
  convex: string
  over: string
}

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // 現在の凸状況を履歴に残す
  await saveHistory(msg)
  await util.Sleep(50)

  // 凸数と持ち越しの状態を更新する
  const content = util.Format(msg.content)
  const state = await statusUpdate(msg, content)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // 3凸終了者の場合は凸終了の処理、していない場合は現在の凸状況を報告
  const end = await isThreeConvex(state)
  if (end) {
    await convexEndProcess(msg)
  } else {
    // 凸状況を報告する
    await msg.reply(`${state.convex}凸目 ${state.over ? '持ち越し' : '終了'}`)
  }
}

/**
 * 現在の凸状況を履歴に残す
 * @param msg DiscordからのMessage
 */
const saveHistory = async (msg: Discord.Message) => {
  // メンバーの状態を取得
  const member = await members.FetchMember(msg.author.id)
  if (!member) return

  // 現在の凸状況を履歴に残す
  member.history = `${member.convex}${member.over ? '+' : ''}`

  // ステータスを更新
  await members.UpdateMember(member)
}

/**
 * 凸数と持ち越しの状態を変更する
 * @param msg DiscordからのMessage
 * @param content 凸報告の内容
 */
const statusUpdate = async (msg: Discord.Message, content: string): Promise<State> => {
  // メンバーの状態を取得
  const member = await members.FetchMember(msg.author.id)
  if (!member) return {convex: '', over: ''}

  // 凸数を増やす
  const countUp = (convex: string): string => String(Number(convex) + 1)

  // ボスを倒した場合はtrue、倒していない場合はfalse
  if (/^k|kill/i.test(content)) {
    if (member.over === '1') {
      member.over = ''
    } else {
      member.convex = countUp(member.convex)
      member.over = '1'
    }
  } else {
    if (member.over === '1') {
      member.over = ''
    } else {
      member.convex = countUp(member.convex)
    }
  }

  // ステータスを更新
  await members.UpdateMember(member)

  return {convex: member.convex, over: member.over}
}

/**
 * 3凸終了しているかの真偽値を返す
 * @param 凸数と持ち越し
 * @return 3凸しているかの真偽値
 */
const isThreeConvex = async (state: State): Promise<boolean> => {
  // 3凸目じゃなければfalse
  if (state.convex !== '3') return false

  // 持ち越し状態があればfalse
  if (state.over === '1') return false

  // 3凸目で持ち越しがなければ3凸終了者なのでtrue
  return true
}

/**
 * 3凸終了の扱いにし、凸残ロールを削除し、何人目の3凸終了者か報告をする
 * @param msg DiscordからのMessage
 */
const convexEndProcess = async (msg: Discord.Message) => {
  // メンバーの状態を取得
  const member = await members.FetchMember(msg.author.id)
  if (!member) return false

  // 3凸終了のフラグを立てる
  member.convex = '3'
  member.over = ''
  member.end = '1'

  // ステータスを更新
  await members.UpdateMember(member)
  await util.Sleep(50)

  // 凸残ロールを削除
  await msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const state = await members.Fetch()
  const n = state.filter(s => s.end === '1').length
  await msg.reply(`3凸目 終了\n\`${n}\`人目の3凸終了よ！`)
}
