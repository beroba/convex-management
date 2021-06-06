import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as status from '../../io/status'
import * as spreadsheet from '../../util/spreadsheet'
import {User} from '../../io/type'
import * as util from '../../util'

/**
 * 同時凸の持ち越し計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // 持ち越し秒数を計算
  const a = overCalc(HP, A, B)
  const b = overCalc(HP, B, A)

  // 計算結果を出力
  msg.reply(`\`\`\`A ${a}s\nB ${b}s\`\`\`ダメージの高い方を先に通した方が持ち越し時間が長くなるわよ！`)
}

/**
 * 持ち越しの計算をする
 * 計算式: 持ち越し時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
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
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // 名前順にソート

  // ステータスを更新
  await status.UpdateUsers(users)
  await util.Sleep(100)

  // スプレッドシートに名前とidを保存する
  await fetchNameAndID(users, Settings.INFORMATION_SHEET.SHEET_NAME)
}

/**
 * 妹クランのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
export const UpdateSisters = async (msg: Discord.Message) => {
  // 妹クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.SISTER_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
      limit: '',
      declare: '',
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // 名前順にソート

  // スプレッドシートに名前とidを保存する
  await fetchNameAndID(users, Settings.SISTER_SHEET.SHEET_NAME)
}

/**
 * 指定されたシートにメンバーの名前とidを保存する
 * @param members メンバーの情報
 * @param name 書き込むシートの名前
 */
const fetchNameAndID = async (users: Option<User[]>, name: string) => {
  // 値がない場合は終了
  if (!users) return

  // 書き込み先のシートを取得
  const sheet = await spreadsheet.GetWorksheet(name)

  // メンバー一覧を更新
  await Promise.all(
    users.map(async (m, i) => {
      const col = Settings.INFORMATION_SHEET.MEMBER_COLUMN

      // 名前を更新
      const name_cell = await sheet.getCell(`${col}${i + 3}`)
      name_cell.setValue(m.name)

      // idを更新
      const id_cell = await sheet.getCell(`${AtoA(col, 1)}${i + 3}`)
      id_cell.setValue(m.id)
    })
  )
}
