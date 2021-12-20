import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from './status'
import * as lapAndBoss from '../lapAndBoss'
import * as util from '../../util'
import {AtoE} from '../../util/type'

/**
 * 凸宣言のコマンドを処理する
 * @param content ダメージ報告のメッセージ
 * @param msg DiscordからのMessage*
 * @param alpha ボス番号
 * @return コマンドの実行結果
 */
export const Process = async (content: string, alpha: AtoE, msg: Discord.Message): Promise<Option<string>> => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  switch (true) {
    case /\/(del|d)/i.test(content): {
      const list = content.replace(/\/(del|d)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.DeleteDamage(numbers, alpha, channel, msg)
      return 'Delete damage'
    }

    case /\/(or|o)/i.test(content): {
      const list = content.replace(/\/(or|o)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)
      if (numbers.length < 2) return

      await status.RandomSelection(numbers, alpha, channel, msg)
      return 'Random selection'
    }

    case /\/(calc|c)/i.test(content): {
      const list = content.replace(/\/(calc|c)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)
      if (numbers.length !== 2) return

      await status.CarryoverCalculation(numbers, alpha, channel, msg)
      return 'Carryover calculation'
    }

    case /\/(@|hp?)/i.test(content): {
      content = content.replace(/\/hp?/gi, '@')
      await status.RemainingHPChange(content, alpha, undefined, msg)
      return 'Remaining HP change'
    }

    case /\/(lap|l)/i.test(content): {
      const list = content.match(/\d+/g)
      if (!list) return
      const lap = list.map(l => l).first()

      await lapAndBoss.UpdateLap(lap.to_n(), alpha, msg)
      return 'Change boss'
    }

    case /\/_(\d|[a-z])+$/i.test(content): {
      const list = content.match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.ExclusionSettings(numbers, alpha, channel, msg)
      return 'Exclusion settings'
    }

    case /\/(\d|[a-z]|\s)+$/i.test(content): {
      const list = content.match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.ThroughNotice(numbers, alpha, channel, msg)
      return 'Through notification'
    }
  }
}

/**
 * 正規表現のリストから重複を省いたリストにして返す
 * @param list 受け取った正規表現のリスト
 * @returns 番号一覧
 */
const fetchNumbers = (list: RegExpMatchArray): string[] => {
  const set = list
    .map(l => l)
    .join('')
    .split('')
  return [...new Set(set)]
}
