import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as declare from '../convex/declare/react'
import * as etc from '../convex/etc'
import * as over from '../convex/over'
import * as plan from '../convex/plan/delete'
import * as report from '../convex/report/cancel'
import * as attendance from '../convex/time/attendance'
import * as limit from '../convex/time/limit'
import * as playerID from '../util/playerID'

/**
 * リアクションのイベントに応じて適切な処理を実行する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 */
export const MessageReactionAdd = async (react: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  const isBeroba = react.message.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  let comment: Option<string>
  user = user as Discord.User

  comment = await declare.ConfirmNotice(react, user)
  if (comment) return console.log(comment)

  comment = await declare.OverNotice(react, user)
  if (comment) return console.log(comment)

  comment = await declare.StayMark(react, user)
  if (comment) return console.log(comment)

  comment = await report.Cancel(react, user)
  if (comment) return console.log(comment)

  comment = await plan.Already(react, user)
  if (comment) return console.log(comment)

  comment = await over.Delete(react, user)
  if (comment) return console.log(comment)

  comment = await etc.SisterReactDelete(react, user)
  if (comment) return console.log(comment)

  comment = await limit.Add(react, user)
  if (comment) return console.log(comment)

  comment = await attendance.Remove(react, user)
  if (comment) return console.log(comment)

  comment = await attendance.Add(react, user)
  if (comment) return console.log(comment)

  comment = await playerID.RoleGrant(react, user)
  if (comment) return console.log(comment)
}
