import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import {Command} from './command'
import * as report from './report'
import * as plan from './plan'
import * as carryover from './convex/carryover'
import * as sister from './convex/sister'
import * as playerID from './etc/playerID'
import * as send from './etc/send'

/**
 * 入力されたメッセージに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const Message = async (msg: Discord.Message) => {
  // クランのサーバーでなければ終了
  if (msg.guild?.id !== ThrowEnv('CLAN_SERVER_ID')) return

  // `/`から始まるコマンドの処理
  if (msg.content.charAt(0) === '/') return Command(msg)

  let comment: Option<string>

  // 特定のメッセージに絵文字を付ける
  send.Emoji(msg)

  // 凸報告の処理を行う
  comment = await report.Convex(msg)
  if (comment) return console.log(comment)

  // 凸予定の処理を行う
  comment = await plan.Convex(msg)
  if (comment) return console.log(comment)

  // 持ち越し状況に絵文字をつける
  comment = carryover.React(msg)
  if (comment) return console.log(comment)

  // 持ち越し凸先に絵文字をつける
  comment = sister.React(msg)
  if (comment) return console.log(comment)

  // プレイヤーIDの保存処理を行う
  comment = await playerID.Save(msg)
  if (comment) return console.log(comment)

  // メッセージにカンカンカンが含まれている場合の処理
  comment = send.GoodMorning(msg)
  if (comment) return console.log(comment)

  // メッセージの先頭がおはなしの場合の処理
  comment = await send.Speak(msg)
  if (comment) return console.log(comment)

  // メッセージにorが含まれている場合の処理
  comment = send.AorB(msg)
  if (comment) return console.log(comment)

  // ヤバイの文字がある場合に画像を送信
  comment = send.YabaiImage(msg)
  if (comment) return console.log(comment)
}
