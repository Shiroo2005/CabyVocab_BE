import express from 'express'
import roleRouter from './role.route'

import authRouter from './auth.route'
import userRouter from './user.route'
import topicRouter from './topic.route'
import wordRouter from './word.route'
import courseRouter from './course.route'
import { emailRouter } from './email.route'
import uploadRouter from './upload.route'
import { userProgressRouter } from './userProgress.route'
import { exerciseRouter } from './exercise.route'
import { orderRouter } from './order.route'
import { systemEarningRouter } from './systemEarning.route'
import { payoutRouter } from './payout.route'
import { postRouter } from './post.route'

const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)

router.use('/topics', topicRouter)
router.use('/words', wordRouter)
router.use('/courses', courseRouter)
router.use('/progress', userProgressRouter)
router.use('/emails', emailRouter)
router.use('/upload', uploadRouter)
router.use('/exercise', exerciseRouter)
router.use('/orders', orderRouter)
router.use('/system-earning', systemEarningRouter)
router.use('/payout', payoutRouter)
router.use('/posts', postRouter)

export default router
