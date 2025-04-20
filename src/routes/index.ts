import express from 'express'
import roleRouter from './role.route'

import authRouter from './auth.route'
import userRouter from './user.route'
import topicRouter from './topic.route'
import wordRouter from './word.route'
import courseRouter from './course.route'
import { emailRouter } from './email.route'

const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)

router.use('/topics', topicRouter)
router.use('/words', wordRouter)
router.use('/courses', courseRouter)
router.use('/emails', emailRouter)

export default router
