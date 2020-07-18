import throwEnv from 'throw-env'

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

/**
 * GoogleSpreadSheetから指定されたシートを取得する
 * @param name シートの名前
 * @return 取得したシート
 */
export const GetWorksheet = async (name: string): Promise<any> => {
  // GoogleSpreadSheetで使う定数を定義
  const CREDS = JSON.parse(throwEnv('CREDS'))
  const SHEET_ID = throwEnv('SHEET_ID')

  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  return sheet.getWorksheetByName(name)
}
