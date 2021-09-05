import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import {Command} from '../command'
import * as declare from '../convex/declare'
import * as etc from '../convex/etc'
import * as over from '../convex/over'
import * as plan from '../convex/plan'
import * as report from '../convex/report'
import * as emoji from '../util/emoji'
import * as playerID from '../util/playerID'
import * as send from '../util/send'

/**
 * 入力されたメッセージに応じて適切な処理を実行する
 * @param msg DiscordからのMessage
 */
export const MessageCreate = async (msg: Discord.Message) => {
  let comment: Option<string>

  const isBeroba = msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (isBeroba) {
    if (msg.content.charAt(0) === '/') return await Command(msg)

    emoji.React(msg)

    comment = await declare.Convex(msg)
    if (comment) return console.log(comment)

    comment = await report.Convex(msg)
    if (comment) return console.log(comment)

    comment = await plan.Convex(msg)
    if (comment) return console.log(comment)

    comment = over.React(msg)
    if (comment) return console.log(comment)

    comment = etc.SisterReactAdd(msg)
    if (comment) return console.log(comment)

    comment = await playerID.Save(msg)
    if (comment) return console.log(comment)

    comment = send.GoodMorning(msg)
    if (comment) return console.log(comment)
  }

  comment = await send.Speak(msg)
  if (comment) return console.log(comment)

  comment = send.AorB(msg)
  if (comment) return console.log(comment)

  if (msg.guild?.id === ThrowEnv('CLAN_SERVER_ID')) {
    comment = await emoji.Send(msg)
    if (comment) return console.log(comment)

    comment = send.NikuPicture(msg)
    if (comment) return console.log(comment)

    comment = send.AddSeihekiRole(msg)

    comment = send.YabaiImage(msg)
    if (comment) return console.log(comment)

    comment = send.ShinyTmoImage(msg)
    if (comment) return console.log(comment)

    comment = send.TasuketeImage(msg)
    if (comment) return console.log(comment)

    comment = await send.KusaGacha(msg)
    if (comment) return console.log(comment)

    comment = await send.SendUsoOre(msg)
    if (comment) return console.log(comment)

    comment = await send.SendAguhiyori(msg)
    if (comment) return console.log(comment)
  }
}
