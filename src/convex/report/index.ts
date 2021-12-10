import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as update from './update'
import * as list from './list'
import * as declare from '../declare'
import * as declareList from '../declare/list'
import * as declareStatus from '../declare/status'
import * as over from '../over'
import * as role from '../role'
import * as attendance from '../role/attendance'
import * as situation from '../situation'
import * as limit from '../timeLimit'
import * as cancel from '../plan/delete'
import * as current from '../../io/current'
import * as damageList from '../../io/damageList'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Member} from '../../util/type'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isChannel = msg.channel.id === Settings.CHANNEL_ID.CONVEX_REPORT
  if (!isChannel) return

  let member_1 = await status.FetchMember(msg.author.id)
  if (!member_1) {
    msg.reply('クランメンバーじゃないわ')
    return 'Not a clan member'
  }

  if (member_1.end) {
    msg.reply('もう3凸してるわ')
    return '3 Convex is finished'
  }

  // 3凸終わっている場合の処理
  const result = await threeConvexProcess(member_1, msg)
  if (result) return '3 Convex is finished'

  // 持越がないのに持越凸しようとした場合 (基本的にありえない)
  if (member_1.carry && !/[1-3]/.test(member_1.over.to_s())) {
    msg.reply('持越がないのに持越凸になってるわ')
    return 'Not carry over'
  }

  let errText: Option<string>
  ;[member_1, errText] = await confirmConvexDeclare(member_1, msg)
  if (errText) return errText

  const carry = member_1.carry
  const alpha = <AtoE>member_1.declare

  const content = await fetchHPOrEmpty(member_1, alpha, msg)

  // 凸状況を更新
  let members: Member[], member_2: Option<Member>
  ;[members, member_2] = await update.Status(member_1, content)
  if (!member_2) return

  let state = await current.Fetch()
  const overMsgs = await over.GetAllUserMsg(member_2.id)

  await list.Reply(members, member_2, carry, state, alpha, overMsgs, content, msg)

  // @が入っている場合、HPの変更
  if (/@\d/.test(content)) {
    state = await declareStatus.RemainingHPChange(content, alpha, state)
  }

  // 凸予定削除より先に離席中ロールを外す
  await attendance.Remove(member_2.id.first())

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(msg.content)) {
    cancel.Remove(alpha, member_2.id.first())
    situation.Plans()
  }

  overDelete(member_2, carry, overMsgs)

  situation.Report(members, state)
  situation.Boss(members, state)

  if (content !== '@0') {
    declare.Done(alpha, member_2)
  }
  situation.DeclarePlan(alpha, state)

  msg.react(Settings.EMOJI_ID.TORIKESHI)

  if (member_2.end) {
    // 3凸終了している場合に不要なロールを外す
    const guildMember = await util.MemberFromId(member_2.id.first())
    guildMember.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)
    role.RemoveBossRole(msg.member)
  }

  limit.Display(members)

  return 'Update status'
}

/**
 * 凸が終わっている場合は終了させる
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 * @return 凸が終わっているかの真偽値
 */
const threeConvexProcess = async (member: Member, msg: Discord.Message): Promise<boolean> => {
  if (member.convex || member.over) return false

  member.end = true
  const members = await status.UpdateMember(member)

  const n = members.filter(s => s.end).length + 1

  // prettier-ignore
  const text = [
    '```ts',
    `残凸数: 0, 持越数: 0`,
    `${n}人目の3凸終了よ！`,
    '```'
  ].join('\n')
  await msg.reply(text)

  return true
}

/**
 * 凸宣言とダメージ報告を確認してエラーかどうか確認する
 * @param member メンバーの状態
 * @param msg DiscordからのMessage
 * @return [メンバーの状態, エラーテキスト]
 */
const confirmConvexDeclare = async (member: Member, msg: Discord.Message): Promise<[Member, Option<string>]> => {
  const damageBoss = await fetchBossNumberForDamages(member)

  // 凸宣言がない場合
  if (member.declare === '') {
    if (damageBoss.length === 1) {
      // ダメージ報告が1つなら、そのボスに凸宣言した事にする
      member.declare = damageBoss
      await status.UpdateMember(member)

      return [member, undefined]
    } else {
      msg.reply('凸宣言をしてから凸報告をしてね')
      return [member, 'Not declared convex']
    }
  }

  // 凸宣言が1つの場合
  if (member.declare.length === 1) {
    // ダメージ報告がない場合はスルー
    if (damageBoss === '') {
      return [member, undefined]
    }
    // 凸宣言とダメージ報告のボスが同じか確認
    if (damageBoss.includes(member.declare)) {
      return [member, undefined]
    } else {
      msg.reply('凸宣言をしているボスとダメージ報告のボスが違うから確認してね')
      return [member, 'The boss of the damage report is different']
    }
  }

  // 凸宣言が複数の場合
  if (member.declare.length > 1) {
    if (damageBoss.length === 1) {
      // ダメージ報告が1つなら、そのボスに凸宣言した事にする
      member.declare = damageBoss
      await status.UpdateMember(member)

      return [member, undefined]
    } else {
      const alphas = member.declare.split('')
      member.declare = ''
      const members = await status.UpdateMember(member)

      // 凸宣言していたボスの表を更新
      alphas.forEach(a => declareList.SetUser(<AtoE>a, undefined, members))

      msg.reply('凸宣言が複数されていたからリセットしたわ\nもう一度凸宣言してね')
      return [member, 'Duplicate convex declaration']
    }
  }

  return [member, 'Impossible']
}

/**
 * 受け取ったメンバーがダメージ報告していたボス番号を文字列にして返す
 * @param member メンバーの状態
 * @returns
 */
const fetchBossNumberForDamages = async (member: Member): Promise<string> => {
  const dList = await damageList.Fetch()
  // メンバーの報告済ではないボス番号を取得
  return 'abcde'
    .split('')
    .map(a => {
      const ds = dList[<AtoE>a]
      const d = ds.filter(d => !d.already).find(d => member.id.find(n => n === d.id))
      return d && a
    })
    .filter(a => a)
    .join('')
}

/**
 * msgのcontentから@HPまたは空にして返す;
 * @param member メンバーの状態
 * @param alpha ボスの番号
 * @param msg DiscordからのMessage
 * @return 変更後のcontent
 */
const fetchHPOrEmpty = async (member: Member, alpha: AtoE, msg: Discord.Message): Promise<string> => {
  const content = util.Format(msg.content)

  // killの場合は@0にする
  if (/^k|kill|き(っ|l)l/i.test(content)) {
    return '@0'
  }

  // @HPの場合は@HPだけ取り除く
  if (/@\d+/.test(content)) {
    const hp = (content.match(/@\d+/) as RegExpMatchArray).map(e => e).first()
    return hp
  }

  // 数字ではない場合は空
  const num = content.replace(/[^\d]/g, '').to_n()
  if (!num) return ''

  const damages = await damageList.FetchBoss(alpha)
  const d = damages.find(d => member.id.find(n => n === d.id))
  const damage = d ? d.damage : 0

  // ダメージが0の場合は空
  if (!damage) return ''

  // ダメージ集計のダメージと報告のメッセージに、1000以上の差分がある場合は@HPにする
  const diff = Math.abs(num - damage)
  if (diff >= 1000) {
    return `@${num}`
  } else {
    return ''
  }
}

/**
 * 3凸終了時または持越凸の際にメッセージが1つの場合、持越状況のメッセージを削除する
 * @param member メンバーの状態
 * @param carry 持越か否かの真偽値
 * @param overMsgs メンバーの持越状況のメッセージ一覧
 */
const overDelete = (member: Member, carry: boolean, overMsgs: Discord.Message[]) => {
  // 3凸終了している場合、持越を全て削除
  if (member.end) {
    over.DeleteAllUserMsg(overMsgs)
  }

  // 持越凸でない場合は終了
  if (!carry) return

  // 持越状況のメッセージが1つの場合は削除
  if (overMsgs.length === 1) {
    over.DeleteAllUserMsg(overMsgs)
  }
}
