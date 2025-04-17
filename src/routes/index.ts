import express from 'express'
import roleRouter from './role.route'

import authRouter from './auth.route'
import userRouter from './user.route'
import topicRouter from './topic.route'
import wordRouter from './word.route'
import courseRouter from './course.route'

const router = express.Router()

router.use('/roles', roleRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)

router.use('/topic', topicRouter)
router.use('/word', wordRouter)
router.use('/course', courseRouter)

export default router
