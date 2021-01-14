import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as members from '../../io/members'
import {Member} from '../../io/type'
import * as util from '../../util'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // メンバーの状態を取得
  let member = await members.FetchMember(msg.author.id)
  if (!member) return

  // 現在の凸状況を履歴に残す
  member = await saveHistory(member)

  // 凸数と持ち越しの状態を更新する
  const content = util.Format(msg.content)
  member = await statusUpdate(member, content)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // 3凸終了者の場合は凸終了の処理、していない場合は現在の凸状況を報告
  const end = await isThreeConvex(member)
  if (end) {
    member = await convexEndProcess(member, msg)
  } else {
    // 凸状況を報告する
    await msg.reply(`${member.convex}凸目 ${member.over ? '持ち越し' : '終了'}`)
  }

  // ステータスを更新
  await members.UpdateMember(member)
}

/**
 * 現在の凸状況を履歴に残し返す
 * @param member 更新するメンバー
 * @return 更新したメンバー
 */
const saveHistory = async (member: Member): Promise<Member> => {
  // 現在の凸状況を履歴に残す
  member.history = `${member.convex}${member.over ? '+' : ''}`
  return member
}

/**
 * 凸数と持ち越しの状態を変更し返す
 * @param member 更新するメンバー
 * @param content 凸報告の内容
 * @return 更新したメンバー
 */
const statusUpdate = async (member: Member, content: string): Promise<Member> => {
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

  return member
}

/**
 * 3凸終了しているかの真偽値を返す
 * @param 凸数と持ち越し
 * @return 3凸しているかの真偽値
 */
const isThreeConvex = async (member: Member): Promise<boolean> => {
  // 3凸目じゃなければfalse
  if (member.convex !== '3') return false

  // 持ち越し状態があればfalse
  if (member.over === '1') return false

  // 3凸目で持ち越しがなければ3凸終了者なのでtrue
  return true
}

/**
 * 凸残ロールを削除し、何人目の3凸終了者か報告し、3凸終了の扱いにして返す
 * @param member 更新するメンバー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
const convexEndProcess = async (member: Member, msg: Discord.Message): Promise<Member> => {
  // 3凸終了のフラグを立てる
  member.end = '1'

  // 凸残ロールを削除
  await msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const state = await members.Fetch()
  const n = state.filter(s => s.end === '1').length + 1
  await msg.reply(`3凸目 終了\n\`${n}\`人目の3凸終了よ！`)

  return member
}
