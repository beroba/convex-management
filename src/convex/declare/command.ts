import * as Discord from 'discord.js'
import * as status from './status'
// import * as command from '../../command'
import {AtoE} from '../../util/type'

// const args = command.ExtractArgument(_command, _content)

/**
 * 凸宣言のコマンドを処理する
 * @param msg DiscordからのMessage
 * @param content ダメージ報告のメッセージ
 * @param alpha ボス番号
 */
export const Process = async (msg: Discord.Message, content: string, alpha: AtoE) => {
  msg
  switch (true) {
    case /\/(@|hp?)/i.test(content): {
      content = content.replace(/\/hp?/gi, '@')
      await status.RemainingHPChange(content, alpha)
      return 'Remaining HP change'
    }
  }
}
