import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'

const topicRouter = express.Router()

// access token validation
topicRouter.use(accessTokenValidation)

//GET

//POST

//PATH

//PUT

//DELETE

export default topicRouter