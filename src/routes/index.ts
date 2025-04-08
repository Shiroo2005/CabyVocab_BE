import express from 'express'
import roleRouter from './role.route'
import userRoute from './user.route';
const router = express.Router()

router.use('/roles', roleRouter);

router.use('/user', userRoute);

export default router
