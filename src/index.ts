import express from 'express'
import authRouter from './routes/auth.route'
import { config } from 'dotenv'
import { errorHandler, notFoundHandler } from './utils/handler'
import { morganMiddleware } from './middlewares/morgan.middlewares'
import helmet from 'helmet'
import compression from 'compression'
import { databaseService } from './services/database.service'
import router from './routes'
import { NotFoundRequestError } from './core/error.response'
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
databaseService.init()
//////////////////////////////

//ROUTES
app.use(router)
//////////////////////////////

//DEFAULT HANDLER
//not found handler
app.use(notFoundHandler)

// error handler
app.use(errorHandler)
//////////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
