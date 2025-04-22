import { userController } from '~/controllers/user.controller'
import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'

const courseRouter = express.Router()

// access token validation
courseRouter.use(accessTokenValidation)

//GET

//POST

//PATH

//PUT

//DELETE

export default courseRouter