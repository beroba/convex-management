import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as members from '../../io/members'
import * as util from '../../util'
import * as carryover from '../convex/carryover'
import * as situation from '../convex/situation'
import * as status from './status'
import * as cancel from '../plan/cancel'
import * as lapAndBoss from '../convex/lapAndBoss'

/**
 * 凸状況の状態
 */
export type Status = {
  already: boolean
  over: boolean
  end: boolean
}

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.author.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  {
    // メンバーの状態を取得
    const member = await members.FetchMember(msg.author.id)

    // クランメンバーでなければ終了
    if (!member) {
      msg.reply('クランメンバーじゃないわ')
      return 'Not a clan member'
    }

    // 3凸していた場合は終了
    if (member.end === '1') {
      msg.reply('もう3凸してるわ')
      return '3 Convex is finished'
    }
  }

  // ボスが討伐されていたら次のボスへ進める
  killConfirm(msg)

  // 持ち越しがある場合、持ち越し状況のメッセージを全て削除
  overDelete(msg)

  // 凸状況を更新
  await status.Update(msg)
  await util.Sleep(50)

  {
    // メンバーの状態を取得
    const member = await members.FetchMember(msg.author.id)
    if (!member) return

    members.ReflectOnSheet(member)

    // 凸予定の削除
    if (member?.end === '1') {
      cancel.AllComplete(msg.author.id)
    } else {
      cancel.Report(msg)
    }
  }

  // 凸状況に報告
  situation.Report()

  return 'Update status'
}

/**
 * ボスが討伐されていたら次のボスへ進める
 * @param msg DiscordからのMessage
 */
const killConfirm = (msg: Discord.Message) => {
  // 全角を半角に変換
  const content = util.Format(msg.content)

  // killが入って居なければ終了
  if (!/^k|kill/i.test(content)) return

  // 次のボスへ進める
  lapAndBoss.Next()
}

/**
 * 持ち越しがある場合、持ち越し状況のメッセージを全て削除する
 * @param msg DiscordからのMessage
 */
const overDelete = async (msg: Discord.Message) => {
  // 持ち越しがなければ終了
  const member = await members.FetchMember(msg.author.id)
  if (member?.over !== '1') return

  // 持ち越しを持っている人のメッセージを削除
  carryover.AllDelete(msg.member)
}
