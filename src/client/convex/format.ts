import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'

/**
 * TLを正しい書式に整形させる、
 * timeが指定されていた場合は、その持ち越し秒数にする
 * @param tl 整形させるTL
 * @param time 持ち越し秒数
 * @param msg DiscordからのMessage
 */
export const TL = async (tl: string, time: Option<string>, msg: Discord.Message) => {
  // TLの整形をする
  const content = new generate(tl, time) // 元になるクラスを生成
    .zenkakuToHankaku() // 全角を半角に変換
    .bracketSpaceAdjustment() // 括弧の前後スペースを調整
    .timeParser() // 時間のパースをする
    .toCodeBlock() // コードブロックにする
    .alignVertically() // TLの縦を合わせる
    .toString() // 文字列に戻す

  msg.reply(content)
}

class generate {
  tl: string
  time: Option<string>

  /**
   * TLを整形させるクラス
   * @param tl 整形させるTL
   * @param time 持ち越し秒数
   */
  constructor(tl: string, time: Option<string>) {
    this.tl = tl
    this.time = time
  }

  /**
   * 全角を半角に置き換える
   * @return this
   */
  zenkakuToHankaku(): this {
    this.tl = moji(this.tl).convert('ZE', 'HE').convert('ZS', 'HS').toString()
    return this
  }

  /**
   * 括弧の前後スペースを調整する
   * @return this
   */
  bracketSpaceAdjustment(): this {
    this.tl = this.tl.replace(/ *\( */g, '(').replace(/ *\) */g, ')')
    this.tl = this.tl.replace(/\(/g, ' (').replace(/\)/g, ') ')
    return this
  }

  /**
   * 時間の形を整形する
   * @return this
   */
  timeParser(): this {
    this.tl = this.tl.replace(/\./g, ':')

    const tl = this.tl.split('')

    /**
     * 数字以外になるまでカウンタを進める
     * @param tl TL
     * @param i カウンタ
     * @returns 返却するカウンタ
     */
    const countUpToChar = (tl: string[], i: number): number => {
      for (; i < tl.length; i++) {
        if (!/\d/.test(tl[i])) break
      }
      return i
    }

    for (let i = 0; i < tl.length; i++) {
      // 数字以外は次へ
      if (!/\d/.test(tl[i])) continue

      if (/:/.test(tl[i + 1])) {
        // :の次が数字でないなら次へ
        if (!/\d/.test(tl[i + 2])) continue

        if (/\d/.test(tl[i + 3])) {
          // N:NNなので次へ
          if (!/\d/.test(tl[i + 4])) {
            i += 3
            continue
          }

          // N:NNN*なので、数字以外になるまでカウンターを進める
          i = countUpToChar(tl, i + 4)
        } else {
          // N:N→N:0N
          i += 2
          tl[i] = `0${tl[i]}`
        }
      } else if (/\d/.test(tl[i + 1])) {
        if (!/\d/.test(tl[i + 2])) {
          // NN→0:NN
          tl[i] = `0:${tl[i]}`
          i++
          continue
        }

        if (/\d/.test(tl[i + 3])) {
          // NNNN*なので、数字以外になるまでカウンターを進める
          i = countUpToChar(tl, i + 3)
        } else {
          // 0NNと1NNだけ:を入れる
          if (/0|1/.test(tl[i])) {
            // 0NN,1NN→0:NN,1:NN
            tl[i] = `${tl[i]}:`
          }
          i += 2
        }
      } else {
        // N→0:0N
        tl[i] = `0:0${tl[i]}`
      }
    }

    this.tl = tl.join('')

    return this
  }

  /**
   * コードブロックじゃない場合はコードブロックにする
   * @return this
   */
  toCodeBlock(): this {
    if (!/\`\`\`/.test(this.tl)) {
      this.tl = `\`\`\`` + this.tl + `\`\`\``
    }
    return this
  }

  /**
   * TLの縦を合わせる
   * @return this
   */
  alignVertically(): this {
    // スペースを1つにする
    this.tl = this.tl.replace(/\u200B/g, '').replace(/ +/g, ' ')
    this.tl = this.tl
      .split('\n')
      .map(v => {
        // 先頭文字が数字でない場合はそのまま帰す
        if (!/^\d/.test(v)) return v
        // 5文字目がスペースでない場合はスペースを挿入
        v = / /.test(v[4]) ? v : `${v.slice(0, 4)} ${v.slice(4)}`
        return v
      })
      // 先頭がスペースの場合は4文字スペースを追加する
      .map(v => (/ /.test(v[0]) ? `    ${v}` : v))
      // 行末のスペースを取り除く
      .map(v => v.replace(/ +$/g, ''))
      .join('\n')
    return this
  }

  /**
   * 文字列に変換する
   * @return 整形したTL
   */
  toString(): string {
    return this.tl
  }
}
