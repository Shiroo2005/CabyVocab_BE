import express from 'express'
import roleRouter from './role.route'

import authRouter from './auth.route'
import userRouter from './user.route'
const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)

export default router
