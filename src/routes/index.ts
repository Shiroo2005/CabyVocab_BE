import express from 'express'
import roleRouter from './role.route'
import authRouter from './auth.route'
const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)

export default router
