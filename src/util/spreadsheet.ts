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
