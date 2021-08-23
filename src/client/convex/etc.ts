import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../../io/status'
import * as json from '../../io/json'
import {User, Json} from '../../io/type'
import * as util from '../../util'

/**
 * 同時凸の持越計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // 持越秒数を計算
  const a = overCalc(HP, A, B)
  const b = overCalc(HP, B, A)

  // 計算結果を出力
  msg.reply(`\`\`\`A ${a}s\nB ${b}s\`\`\`ダメージの高い方を先に通した方が持越時間が長くなるわよ！`)
}

/**
 * 持越の計算をする
 * 計算式: 持越時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a AのHP
 * @param b BのHP
 * @return 計算結果
 */
const overCalc = (HP: number, a: number, b: number): number => {
  return Math.ceil(90 - (((HP - a) * 90) / b - 20))
}

/**
 * メッセージ送信者にタスキルロールを付与する
 * @param msg DiscordからのMessage
 */
export const AddTaskKillRoll = async (msg: Discord.Message) => {
  // 既にタスキルしてるか確認する
  const isRole = util.IsRole(msg.member, Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    // タスキルロールを付与する
    await msg.member?.roles.add(Settings.ROLE_ID.TASK_KILL)

    msg.reply('タスキルロールを付けたわよ！')
  }
}

/**
 * 凸残ロールを全て外す
 */
export const RemoveConvexRoles = async () => {
  // べろばあのクランメンバー一覧を取得
  const clanMembers =
    util
      .GetGuild()
      ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
      ?.members.map(m => m) ?? []

  // クランメンバーの凸残ロールを全て外す
  await Promise.all(clanMembers.map(async m => await m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)))
}

/**
 * 指定されたメンバーのボスロールを全て削除する
 * @param member ロールを削除したメンバー
 */
export const RemoveBossRole = async (member: Option<Discord.GuildMember>) => {
  await member?.roles.remove(Settings.BOSS_ROLE_ID.a)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.b)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.c)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.d)
  await member?.roles.remove(Settings.BOSS_ROLE_ID.e)
}

/**
 * スプレッドシートのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
export const UpdateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
      limit: '',
      declare: '',
      carry: false,
    }))
    .sort((a, b) => (a.id > b.id ? 1 : -1)) // ID順にソート
  if (!users) return

  // ステータスを更新
  await status.UpdateUsers(users)

  // jsonの値を更新
  const list: Json = users.map(u => ({[u.id]: u.name})).reduce((a, b) => ({...a, ...b}))
  await json.Update('user', list)
}
