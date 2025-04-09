import { Logger, QueryRunner } from 'typeorm'

class CustomLogger implements Logger {
  private highlightSQL(query: string): string {
    return query
      .replace(/\b(SELECT)\b/gi, '\x1b[32m$1\x1b[0m') // Màu xanh lá
      .replace(/\b(FROM|JOIN|ON|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET)\b/gi, '\x1b[34m$1\x1b[0m') // Màu xanh dương
      .replace(/\b(INSERT INTO|VALUES|UPDATE|SET|DELETE FROM)\b/gi, '\x1b[35m$1\x1b[0m') // Màu tím
      .replace(/\b(AND|OR|NOT|IN|EXISTS|LIKE|BETWEEN)\b/gi, '\x1b[33m$1\x1b[0m') // Màu vàng
      .replace(/\b(AS|DISTINCT|CASE|WHEN|THEN|ELSE|END)\b/gi, '\x1b[36m$1\x1b[0m') // Màu cyan
      .replace(/\b(TRUE|FALSE|NULL)\b/gi, '\x1b[31m$1\x1b[0m') // Màu đỏ
  }

  private formatQuery(query: string, parameters?: any[]): string {
    const formattedQuery = this.highlightSQL(
      query
        .replace(/SELECT/i, '\nSELECT')
        .replace(/FROM/i, '\n  FROM')
        .replace(/WHERE/i, '\n  WHERE')
        .replace(/JOIN/i, '\n  JOIN')
        .replace(/ON/i, '\n    ON')
        .replace(/GROUP BY/i, '\n  GROUP BY')
        .replace(/ORDER BY/i, '\n  ORDER BY')
        .replace(/LIMIT/i, '\n  LIMIT')
        .replace(/VALUES/i, '\n  VALUES')
        .replace(/SET/i, '\n  SET')
        .replace(/INSERT INTO/i, '\nINSERT INTO')
        .replace(/UPDATE/i, '\nUPDATE')
        .replace(/DELETE FROM/i, '\nDELETE FROM')
    )

    return `
\x1b[32m[QUERY]\x1b[0m
\x1b[36mSQL:\x1b[0m${formattedQuery}
\x1b[33mPARAMS:\x1b[0m ${parameters?.length ? JSON.stringify(parameters, null, 2) : 'None'}
---------------------------------------------------------`
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.log(this.formatQuery(query, parameters))
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.error(`
\x1b[41m[QUERY ERROR]\x1b[0m
\x1b[31mError:\x1b[0m ${error}
\x1b[36mSQL:\x1b[0m${this.formatQuery(query, parameters)}
---------------------------------------------------------`)
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.warn(`
\x1b[35m[SLOW QUERY] (⏱ ${time}ms)\x1b[0m
\x1b[36mSQL:\x1b[0m${this.formatQuery(query, parameters)}
---------------------------------------------------------`)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    console.log(`
\x1b[34m[SCHEMA BUILD]\x1b[0m
${message}
---------------------------------------------------------`)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    console.log(`
\x1b[34m[MIGRATION]\x1b[0m
${message}
---------------------------------------------------------`)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    const color = level === 'warn' ? '\x1b[33m' : '\x1b[37m'
    console.log(`
${color}[${level.toUpperCase()}]\x1b[0m
${message}
---------------------------------------------------------`)
  }
}

export const customLogger = new CustomLogger()
