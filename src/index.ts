import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFoundHandler } from './utils/handler'
import { morganMiddleware } from './middlewares/morgan.middlewares'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
import { DatabaseService } from './services/database.service'
import { servingStaticConfig } from './config/static.config'
import './config/passport.config'
import { initSocket } from './sockets'
import { createServer } from 'http'
import './event-listeners'

const app = express()
const port = 8081
config()

//MIDDLE_WARES
// log by morgan
app.use(morganMiddleware)

// protected by helmet
app.use(helmet())

// optimize by compression request
app.use(compression())

// convert request to json
app.use(express.json())
//////////////////////////////

// DATABASE
// init db
DatabaseService.getInstance().init()
//////////////////////////////

// Serving static image
servingStaticConfig(app)

//ROUTES
app.use(router)
//////////////////////////////

//DEFAULT HANDLER
//not found handler
app.use(notFoundHandler)

// error handler
app.use(errorHandler)
//////////////////////////////

const server = createServer(app)

//socket
initSocket(server)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
