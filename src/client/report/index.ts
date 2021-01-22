import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../../io/status'
import * as util from '../../util'
import * as update from './update'
import * as over from '../convex/over'
import * as situation from '../convex/situation'
import * as lapAndBoss from '../convex/lapAndBoss'
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

  // 全角を半角に変換
  const content = util.Format(msg.content)

  // ボスが討伐されていたら次のボスへ進める
  killConfirm(content)

  // 持ち越しがある場合、持ち越し状況のメッセージを全て削除
  overDelete(msg)

  // 凸状況を更新
  await update.Status(msg)
  await util.Sleep(50)

  // メンバーの状態を取得
  const member = await status.FetchMember(msg.author.id)
  if (!member) return

  // 凸状況をスプレッドシートに反映
  status.ReflectOnSheet(member)

  // `/`が入っている場合は凸予定を取り消さない
  if (!/;/i.test(content)) {
    console.log(1)
    // 3凸終了していたら全ての凸予定を削除、そうでない場合は現在のボスの凸予定を削除
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
 * @param content 整形後のメッセージ内容
 */
const killConfirm = (content: string) => {
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
  const member = await status.FetchMember(msg.author.id)
  if (member?.over !== '1') return

  // 持ち越しを持っている人のメッセージを削除
  over.AllDelete(msg.member)
}
