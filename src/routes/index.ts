import express from 'express'
import roleRouter from './role.route'
import userRoute from './user.route'

import authRouter from './auth.route'
const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)
router.use('/roles', roleRouter)

export default router
