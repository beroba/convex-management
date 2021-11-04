import * as Discord from 'discord.js'
import * as status from './status'
import * as lapAndBoss from '../lapAndBoss'
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

    case /\/(l|lap)/i.test(content): {
      const list = content.match(/\d+/g)
      if (!list) return
      const lap = list.map(l => l).first()
      await lapAndBoss.UpdateLap(lap.to_n(), alpha)
      return 'Change boss'
    }
  }
}
