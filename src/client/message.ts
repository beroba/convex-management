import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import {Command} from './command'
import * as report from './report'
import * as plan from './plan'
import * as over from './convex/over'
import * as sister from './convex/sister'
import * as playerID from './etc/playerID'
import * as send from './etc/send'
import * as emoji from './etc/emoji'

/**
 * 入力されたメッセージに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const Message = async (msg: Discord.Message) => {
  let comment: Option<string>

  // クランのサーバーなら実行
  if (msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')) {
    // `/`から始まるコマンドの処理
    if (msg.content.charAt(0) === '/') return await Command(msg)

    // 特定のメッセージに絵文字を付ける
    emoji.React(msg)

    // 凸報告の処理を行う
    comment = await report.Convex(msg)
    if (comment) return console.log(comment)

    // 凸予定の処理を行う
    comment = await plan.Convex(msg)
    if (comment) return console.log(comment)

    // 持ち越し状況に絵文字をつける
    comment = over.React(msg)
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
  }

  // メッセージの先頭がおはなしの場合の処理
  comment = await send.Speak(msg)
  if (comment) return console.log(comment)

  // メッセージにorが含まれている場合の処理
  comment = send.AorB(msg)
  if (comment) return console.log(comment)

  // クランのサーバーなら実行
  if (msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')) {
    // 特定の文字が完全一致していた場合に対応した絵文字を送信
    comment = await emoji.Send(msg)
    if (comment) return console.log(comment)

    // ヤバイの文字がある場合に画像を送信
    comment = send.YabaiImage(msg)
    if (comment) return console.log(comment)

    // シャイニートモの場合に画像を送信
    comment = send.ShinyTmoImage(msg)
    if (comment) return console.log(comment)
  }
}
