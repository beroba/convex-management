import throwEnv from 'throw-env'
import Settings from 'const-settings'

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised')

/**
 * GoogleSpreadSheetから指定されたシートを取得する
 * @param name シートの名前
 * @return 取得したシート
 */
const getWorksheet = async (name: string): Promise<any> => {
  // GoogleSpreadSheetで使う定数を定義
  const CREDS = JSON.parse(throwEnv('CREDS'))
  const SHEET_ID = throwEnv('SHEET_ID')

  const sheet = new GoogleSpreadsheetAsPromised()
  await sheet.load(SHEET_ID, CREDS)
  return sheet.getWorksheetByName(name)
}

;(async () => {
  const name = 'test'

  const worksheet = await getWorksheet(Settings.WHITE_LIST.SHEET)
  const cells = await worksheet.getCells(Settings.WHITE_LIST.CELLS)

  const l = cells.getAllValues().filter((v: string) => v).length
  const cell = await worksheet.getCell(`A${l + 2}`)
  await cell.setValue(name)
})()
