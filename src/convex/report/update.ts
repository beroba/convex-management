import Option from 'type-of-option'
import * as status from '../../io/status'
import {Member} from '../../util/type'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param member メンバーの状態
 * @param content 凸宣言のメッセージ
 * @return [メンバー一覧, メンバーの状態]
 */
export const Status = async (member: Member, content: string): Promise<[Member[], Option<Member>]> => {
  member = saveHistory(member, content)
  member = statusUpdate(member, content)

  if (isThreeConvex(member)) {
    member.end = true
  }

  const members = await status.UpdateMember(member)
  return [members, member]
}

/**
 * 現在の凸状況を履歴に残し返す
 * @param member 更新するメンバー
 * @return 更新したメンバー
 */
const saveHistory = (member: Member, content: string): Member => {
  member.history = `${member.convex}${'+'.repeat(member.over)}|${member.declare}${content}`
  return member
}

/**
 * 凸数と持越の状態を変更し返す
 * @param member 更新するメンバー
 * @param content 凸報告の内容
 * @return 更新したメンバー
 */
const statusUpdate = (member: Member, content: string): Member => {
  if (member.carry) {
    // 持越の場合は持越を1つ減らす
    member.over = member.over - 1
  } else {
    // ボスを倒していたら持越を1つ増やす
    if (/@0/.test(content)) {
      member.over = member.over + 1
    }
    // 凸宣言を1つ減らす
    member.convex = member.convex - 1
  }

  // 凸宣言と持越状態を解除
  member.declare = ''
  member.carry = false

  return member
}

/**
 * 3凸終了しているかの真偽値を返す
 * @param 凸数と持越
 * @return 3凸しているかの真偽値
 */
const isThreeConvex = (member: Member): boolean => {
  // 残凸数が0でなければfalse
  if (member.convex !== 0) return false

  // 持越状態であればfalse
  if (member.over !== 0) return false

  // 3凸目で持越がなければ3凸終了者なのでtrue
  return true
}
