import express from 'express'
import authRouter from './routes/auth.routes'
import { config } from 'dotenv'
import { errorHandler } from './utils/handler'
import { morganMiddleware } from './middlewares/morgan.middlewares'
import helmet from 'helmet'
import compression from 'compression'
import { databaseService } from './services/database.service'
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

// init db
databaseService.connect()
//////////////////////////////

//ROUTES
app.use('/auth', authRouter)
//////////////////////////////

//DEFAULT ERROR HANDLER
app.use(errorHandler)
//////////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
