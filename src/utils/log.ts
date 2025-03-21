import chalk from 'chalk'
import { format } from 'sql-formatter'

const safeFormat = (msg: string, indent: number = 4) => {
  try {
    // Loại bỏ phần "Executing (default):" nếu có
    const sql = msg.replace(/^Executing \(default\):\s*/, '')
    const formattedSql = format(sql, {
      language: 'mysql',
      tabWidth: indent
    })
    const indentString = ' '.repeat(indent)
    return formattedSql
      .split('\n')
      .map((line) => indentString + line) // Thêm thụt lề cho mỗi dòng
      .join('\n')
  } catch {
    return msg // Nếu lỗi thì trả về chuỗi gốc
  }
}

export const LogCustomize = {
  logDB: (msg: string) => console.log(chalk.cyan(`[DB LOG] ${new Date().toISOString()} \n${safeFormat(msg)}`)),
  logSuccess: (msg: string) => console.log(chalk.green(`[SUCCESS] ${msg}`)),
  logError: (msg: string) => console.error(chalk.red(`[ERROR] ${msg}`))
}
