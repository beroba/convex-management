import {AtoA} from 'alphabet-to-number'

/**
 * 指定した列と行のセルを取得する。
 * 列は右にどれだけずらすか指定する
 * @param n 基準の列から右にずらす数
 * @param col 列番号
 * @param row 行番号
 * @param sheet シートの情報
 * @return 取得したセル
 */
export const GetCell = async (n: number, col: string, row: number, sheet: any): Promise<any> => {
  return sheet.getCell(`${AtoA(col, n)}${row}`)
}

/**
 * メンバー一覧から指定したメンバーの行番号を取得
 * @param members メンバー一覧のcell
 * @param id メンバーのid
 * @return 取得した行番号
 */
export const GetMemberRow = (members: string[][], id: string): number => members.map(v => v[1]).indexOf(id) + 3
