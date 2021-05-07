import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as bossTable from '../../io/bossTable'
import * as dateTable from '../../io/dateTable'
import * as status from '../../io/status'
import * as category from '../convex/category'
import * as activityTime from '../convex/activityTime'
import * as etc from '../convex/etc'
import * as react from '../convex/react'
import * as situation from '../convex/situation'

/**
 * 運営管理者用のコマンド
 * @param content 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = async (content: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  // コマンド実行ユーザーかどうかを確認
  const isRole = msg.member?.roles.cache.some(r => Settings.COMMAND_ROLE.some((v: string) => v === r.id))
  if (!isRole) return

  switch (true) {
    case /cb manage reflect/.test(content): {
      // スプレッドシートの値を反映
      await current.ReflectOnCal()
      await util.Sleep(100)
      await status.ReflectOnCal()
      await util.Sleep(100)

      // メンバー全員の状態を取得
      const members = await status.Fetch()
      // 凸状況に報告
      situation.Report(members)

      msg.reply('スプレッドシートの値をキャルに反映させたわよ！')
      return 'Reflect spreadsheet values ​​in Cal'
    }

    case /cb manage create category/.test(content): {
      const arg = content.replace('/cb manage create category', '')
      category.Create(arg, msg)
      return 'Create ClanBattle category'
    }

    case /cb manage delete category/.test(content): {
      const arg = content.replace('/cb manage delete category', '')
      category.Delete(arg, msg)
      return 'Delete ClanBattle category'
    }

    case /cb manage set days/.test(content): {
      const arg = content.replace('/cb manage set days ', '')
      // 日付テーブルを更新する
      await dateTable.Update(arg)

      msg.reply('クランバトルの日付を設定したわよ！')
      return 'Set convex days'
    }

    case /cb manage set boss/.test(content): {
      // ボステーブルを更新する
      await bossTable.Update()

      msg.reply('クランバトルのボステーブルを設定したわよ！')
      return 'Set convex bossTable'
    }

    case /cb manage remove role/.test(content): {
      etc.RemoveRole(msg)
      return 'Release all remaining convex rolls'
    }

    case /cb manage update members/.test(content): {
      // 管理者以外実行できないようにする
      if (msg.author.id !== Settings.ADMIN_ID) {
        msg.reply('botの管理者に更新して貰うように言ってね')
        return
      }
      etc.UpdateMembers(msg)
      return 'Update convex management members'
    }

    case /cb manage update sisters/.test(content): {
      etc.UpdateSisters(msg)
      return 'Update convex management sisters'
    }

    case /cb manage set react/.test(content): {
      // #凸宣言-ボス状況の絵文字を設定
      await react.SetDeclare()
      // #活動時間のチャンネルを取得
      await react.SetActivityTime()

      msg.reply('凸管理用の絵文字を設定したわよ！')
      return 'Set react for convex'
    }

    case /cb manage reflect activity time/.test(content): {
      await activityTime.ReflectOnSheet()
      return 'Reflect activity time on the sheet'
    }

    case /cb manage sheet/.test(content): {
      msg.reply(Settings.URL.SPREADSHEET)
      return 'Show spreadsheet link'
    }
  }
}
