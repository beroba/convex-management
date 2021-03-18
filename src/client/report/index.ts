import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as update from './update'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as limitTime from '../convex/limitTime'
import * as over from '../convex/over'
import * as situation from '../convex/situation'
import * as declare from '../declare/status'
import * as react from '../declare/react'
import * as cancel from '../plan/delete'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  {
    // メンバーの状態を取得
    const member = await status.FetchMember(msg.author.id)

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

  // ボス更新前の状態を取得
  const state = await current.Fetch()

  // 全角を半角に変換
  const content = util.Format(msg.content)

  // ボスを倒したか確認
  if (/^k|kill/i.test(content)) {
    // 凸報告者の凸宣言に書いてあるメッセージを全て削除
    await declare.UserMessageAllDelete(msg.author)

    // 次のボスへ進める
    lapAndBoss.Next()
  } else {
    // 凸宣言を完了
    react.ConvexDone(msg.author)

    // @が入っている場合はHPの変更をする
    if (/@\d/.test(content)) {
      declare.RemainingHPChange(content)
    }
  }

  // 持ち越しがある場合、持ち越し状況のメッセージを全て削除
  overDelete(msg)

  // 凸状況を更新
  const [members, member] = await update.Status(msg)
  if (!member) return
  await util.Sleep(100)

  // 凸状況をスプレッドシートに反映
  status.ReflectOnSheet(member)

  // `;`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    // 3凸終了していたら全ての凸予定を削除、そうでない場合は現在のボスの凸予定を削除
    if (member?.end === '1') {
      cancel.AllRemove(msg.author.id)
    } else {
      cancel.Remove(state.alpha, msg.author.id)
    }
  }

  // #凸状況に報告
  situation.Report(members)

  // 活動限界時間の表示を更新
  limitTime.Display(members)

  return 'Update status'
}

/**
 * 持ち越しがある場合、持ち越し状況のメッセージを全て削除する
 * @param msg DiscordからのMessage
 */
const overDelete = async (msg: Discord.Message) => {
  // 持ち越しがなければ終了
  const member = await status.FetchMember(msg.author.id)
  if (member?.over !== '1') return

  // 持ち越しを持っている人のメッセージを削除
  over.AllDelete(msg.member)
}
