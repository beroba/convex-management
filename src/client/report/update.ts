import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../../io/status'
import {Member} from '../../io/type'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 * @param content 凸宣言のメッセージ
 * @return メンバー一覧とメンバーの状態
 */
export const Status = async (
  member: Member,
  msg: Discord.Message,
  content: string
): Promise<[Member[], Option<Member>]> => {
  // 現在の凸状況を履歴に残す
  member = await saveHistory(member)

  // 凸数と持ち越しの状態を更新する
  member = await statusUpdate(member, content)

  // 凸報告に取消の絵文字をつける
  msg.react(Settings.EMOJI_ID.TORIKESHI)

  // 3凸終了者の場合は凸終了の処理、していない場合は現在の凸状況を報告
  const end = await isThreeConvex(member)
  if (end) {
    member = await ConvexEndProcess(member, msg)
  } else {
    // 凸状況を報告する
    await msg.reply(`${member.convex}凸目、持越${Number(member.over)}つ`)
  }

  // ステータスを更新
  const members = await status.UpdateMember(member)
  return [members, member]
}

/**
 * 現在の凸状況を履歴に残し返す
 * @param member 更新するメンバー
 * @return 更新したメンバー
 */
const saveHistory = async (member: Member): Promise<Member> => {
  // 現在の凸状況を履歴に残す
  member.history = `${member.convex}${'+'.repeat(Number(member.over))}`
  return member
}

/**
 * 凸数と持ち越しの状態を変更し返す
 * @param member 更新するメンバー
 * @param content 凸報告の内容
 * @return 更新したメンバー
 */
const statusUpdate = async (member: Member, content: string): Promise<Member> => {
  if (member.carry) {
    // 持ち越しの場合は持ち越しを1つ減らす
    member.over = String(Number(member.over) - 1)
    member.over = member.over === '0' ? '' : member.over
  } else {
    // ボスを倒していたら持ち越しを1つ増やす
    if (/^k|kill|きっl/i.test(content)) {
      member.over = String(Number(member.over) + 1)
    }
    // 凸宣言を1つ増やす
    member.convex = String(Number(member.convex) + 1)
  }

  // 凸宣言と持ち越し状態を解除
  member.declare = ''
  member.carry = false

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

  // 持ち越し状態であればfalse
  if (member.over !== '') return false

  // 3凸目で持ち越しがなければ3凸終了者なのでtrue
  return true
}

/**
 * 凸残ロールを削除し、何人目の3凸終了者か報告し、3凸終了の扱いにして返す
 * @param member 更新するメンバー
 * @param msg DiscordからのMessage
 * @return 更新したメンバー
 */
export const ConvexEndProcess = async (member: Member, msg: Discord.Message): Promise<Member> => {
  // 3凸終了のフラグを立てる
  member.end = '1'

  // 凸残ロールを削除
  await msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何人目の3凸終了者なのかを報告する
  const members = await status.Fetch()
  const n = members.filter(s => s.end === '1').length + 1
  await msg.reply(`3凸目、持越0つ\n\`${n}\`人目の3凸終了よ！`)

  return member
}
