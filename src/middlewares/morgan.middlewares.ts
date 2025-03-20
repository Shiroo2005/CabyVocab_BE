import { Request } from 'express'
import morgan from 'morgan'

// Custom format cho log xuống dòng
morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2)) // In ra body đẹp hơn
morgan.token('query', (req: Request) => JSON.stringify(req.query, null, 2)) // In ra query

morgan.token('status-icon', (req, res) => {
  const status = res.statusCode
  if (status >= 200 && status < 300) return '✅'
  if (status >= 300 && status < 400) return '📤'
  if (status >= 400 && status < 500) return '❌'
  if (status >= 500) return '🛑'
  return 'ℹ️'
})
export const morganMiddleware = morgan((tokens, req, res) => {
  return [
    '\n==== REQUEST START ====\n',
    `📌 Method: ${tokens.method(req, res)}`,
    `${tokens['status-icon'](req, res)} Status: ${tokens.status(req, res)}`,
    `🌐 URL: ${tokens.url(req, res)}`,
    `⏳ Response Time: ${tokens['response-time'](req, res)} ms`,
    `📦 Body: ${tokens.body(req, res)}`,
    `🔍 Query: ${tokens.query(req, res)}`,
    '\n==== REQUEST END ====\n'
  ].join('\n')
})
