import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import {Command} from './command'
import * as report from './convex/report'
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

  // 凸報告の処理を行う
  comment = await report.Convex(msg)
  if (comment) return console.log(comment)

  // プレイヤーIDの保存処理を行う
  comment = await playerID.Save(msg)
  if (comment) return console.log(comment)

  // ヤバイの文字がある場合に画像を送信
  comment = send.YabaiImage(msg)
  if (comment) return console.log(comment)

  // ユイの文字がある場合にスタンプをつける
  comment = send.YuiKusano(msg)
  if (comment) return console.log(comment)
}
