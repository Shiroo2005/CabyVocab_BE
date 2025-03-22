import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFoundHandler } from './utils/handler'
import { morganMiddleware } from './middlewares/morgan.middlewares'
import helmet from 'helmet'
import compression from 'compression'
import { databaseService } from './services/database.service'
import router from './routes'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
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

//init swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//DEFAULT HANDLER
//not found handler
app.use(notFoundHandler)

// error handler
app.use(errorHandler)
//////////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log('📚 Swagger Docs: http://localhost:8081/api-docs')
})
