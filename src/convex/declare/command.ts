import * as Discord from 'discord.js'
import * as status from './status'
import {AtoE} from '../../util/type'

/**
 * 凸宣言のコマンドを処理する
 * @param msg DiscordからのMessage
 * @param content ダメージ報告のメッセージ
 * @param alpha ボス番号
 */
export const Process = async (msg: Discord.Message, content: string, alpha: AtoE) => {
  msg
  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    await status.RemainingHPChange(content, alpha)
    // return 'Remaining HP change'
  }
}
