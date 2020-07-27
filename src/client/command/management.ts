import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 運営管理者用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  switch (true) {
    case /cb manage create category/.test(command):
      {
        const arg = command.replace('/cb manage create category', '')
        createCategory(msg, arg)
      }
      return 'Create ClanBattle category'

    case /cb manage delete category/.test(command):
      {
        const arg = command.replace('/cb manage delete category', '')
        deleteCategory(msg, arg)
      }
      return 'Delete ClanBattle category'

    case /cb manage update members/.test(command):
      updateMembers(msg)
      return 'Update convex management members'

    case /cb manage sheet/.test(command):
      spreadsheetLink(msg)
      return 'Show spreadsheet link'
  }
}

/**
 * クラバト用のカテゴリーとチャンネルを作成する
 * 引数がある場合は引数の年と日で作成ぢ、ない場合は現在の年と日で作成する
 * @param msg DiscordからのMessage
 * @param arg 作成する年と月
 */
const createCategory = async (msg: Discord.Message, arg: string) => {
  // クランメンバーのロールがあるか確認
  const clanMembers = msg.guild?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
  if (!clanMembers) return

  // カテゴリーの権限を設定
  const permission: Discord.OverwriteResolvable[] = [
    {
      id: msg.guild?.roles.everyone.id || '',
      deny: ['VIEW_CHANNEL'],
    },
    {
      id: clanMembers.id,
      allow: ['VIEW_CHANNEL'],
    },
  ]

  // 引数がある場合は引数の年と日を代入し、ない場合は現在の年と日を代入
  const [year, day] = arg ? arg.split('/').map(Number) : (d => [d.getFullYear(), d.getMonth() + 1])(new Date())

  const channel = await msg.guild?.channels.create(`${year}年${day}月クラバト`, {
    type: 'category',
    position: 4,
    permissionOverwrites: permission,
  })

  // チャンネルの作成
  ;(await channelNameList()).forEach(async name => {
    const c = await msg.guild?.channels.create(name, {type: 'text', parent: channel?.id})
    c?.send(name)
  })

  msg.reply(`${year}年${day}月のカテゴリーを作成したわよ！`)
}

/**
 * 作成するチャンネル名のリストを返す。
 * ボスの名前はスプレッドシートから取得する
 * @return チャンネル名のリスト
 */
const channelNameList = async (): Promise<string[]> => {
  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.CONVEX_SHEET.INFORMATION)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_CELLS.BOSS)

  // ボスの名前を取得
  const [a = 'a', b = 'b', c = 'c', d = 'd', e = 'e'] = util.PiecesEach(cells, 2).map(v => v[1])

  // prettier-ignore
  return [
    '検証総合', '凸ルート相談', '編成相談',
    `${a}模擬`, 'ⓐtl',
    `${b}模擬`, 'ⓑtl',
    `${c}模擬`, 'ⓒtl',
    `${d}模擬`, 'ⓓtl',
    `${e}模擬`, 'ⓔtl',
  ]
}

/**
 * 不要になったクラバト用のカテゴリーとチャンネルを削除する
 * @param msg DiscordからのMessage
 * @param arg 削除する年と月
 */
const deleteCategory = (msg: Discord.Message, arg: string) => {
  const [year, day] = arg.split('/').map(Number)
  if (!year) return msg.reply('ちゃんと年と月を入力しなさい')

  const category = msg.guild?.channels.cache.find(c => c.name === `${year}年${day}月クラバト`)
  if (!category) return msg.reply(`${year}年${day}月クラバトなんてないんだけど！`)

  const channels = category.guild.channels.cache.filter(c => c.parentID === category.id)

  category?.delete()
  // 表示バグが発生してしまうので削除する際に時間の猶予を持たせている
  channels?.forEach(c => setTimeout(() => c.delete(), 1000))

  msg.reply(`${year}年${day}月のカテゴリーを削除したわ`)
}

/**
 * 凸管理のメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const clanMembers: Option<string[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => (m.nickname ? m.nickname : m.user.username))
    .sort()

  // 凸管理のシートを取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.CONVEX_SHEET.MANAGEMENT)

  // メンバー一覧を更新
  clanMembers?.forEach(async (m, i) => {
    const cell = await manageSheet.getCell(`A${i + 2}`)
    await cell.setValue(m)
  })

  msg.reply('凸管理のメンバー一覧を更新したわよ！')
}

/**
 * スプレッドシートのリンクを送信する
 * @param msg DiscordからのMessage
 */
const spreadsheetLink = (msg: Discord.Message) => {
  msg.reply('https://docs.google.com/spreadsheets/d/11uWCeVC5kWKYAWVJrHRoYz502Wue6qHyDtbNM4UULso')
}
