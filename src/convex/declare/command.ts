import * as Discord from 'discord.js'
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
 */
export const Process = async (content: string, alpha: AtoE, msg: Discord.Message) => {
  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  switch (true) {
    case /\/(del|d)/i.test(content): {
      const list = content.replace(/\/(del|d)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.DeleteDamage(numbers, alpha, channel)
      return 'Delete damage'
    }

    case /\/(or|o)/i.test(content): {
      const list = content.replace(/\/(or|o)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)
      if (numbers.length < 2) return

      await status.RandomSelection(numbers, alpha, channel)
      return 'Random selection'
    }

    case /\/(calc|c)/i.test(content): {
      const list = content.replace(/\/(calc|c)/i, '').match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)
      if (numbers.length !== 2) return

      await status.CarryoverCalculation(numbers, alpha, channel)
      return 'Carryover calculation'
    }

    case /\/(@|hp?)/i.test(content): {
      content = content.replace(/\/hp?/gi, '@')
      await status.RemainingHPChange(content, alpha)
      return 'Remaining HP change'
    }

    case /\/(lap|l)/i.test(content): {
      const list = content.match(/\d+/g)
      if (!list) return
      const lap = list.map(l => l).first()

      await lapAndBoss.UpdateLap(lap.to_n(), alpha, msg.author)
      return 'Change boss'
    }

    case /\/_(\d|[a-z])+$/i.test(content): {
      const list = content.match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.ExclusionSettings(numbers, alpha, channel)
      return 'Exclusion settings'
    }

    case /\/(\d|[a-z]|\s)+$/i.test(content): {
      const list = content.match(/(\d|[a-z])+/g)
      if (!list) return
      const numbers = fetchNumbers(list)

      await status.ThroughNotice(numbers, alpha, channel)
      return 'Through notification'
    }
  }
}

const fetchNumbers = (list: RegExpMatchArray): string[] => {
  const set = list
    .map(l => l)
    .join('')
    .split('')
  return [...new Set(set)]
}
