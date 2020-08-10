import ThrowEnv from 'throw-env'

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

/**
 * GoogleSpreadSheetから指定されたシートを取得する
 * @param name シートの名前
 * @return 取得したシート
 */
export const GetWorksheet = async (name: string): Promise<any> => {
  // GoogleSpreadSheetで使う定数を定義
  const CREDS = JSON.parse(ThrowEnv('CREDS'))
  const SHEET_ID = ThrowEnv('SHEET_ID')

  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  return sheet.getWorksheetByName(name)
}

/**
 * 渡されたシートから指定されたセルの範囲を取得する
 * @param sheet シートの値
 * @param range セルの範囲
 */
export const GetCells = async (sheet: any, range: string): Promise<string[]> =>
  (await sheet.getCells(range)).getAllValues()

/**
 * Promiseになっているセルの中身を取得する
 * @param cell 対象のセル
 * @return 取得した中身
 */
export const GetValue = async (cell: any): Promise<any> => (await cell).getValue()

/**
 * Promiseになっているセルの中身を設定する
 * @param cell 対象のセル
 * @param v 設定する値
 */
export const SetValue = async <T>(cell: any, v: T): Promise<void> => (await cell).setValue(v)
