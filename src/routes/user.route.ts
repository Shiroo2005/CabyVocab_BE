import { userController } from "~/controllers/user.controller";
import express from 'express'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const userRoute = express.Router();

userRoute.post('/createUser', wrapRequestHandler(userController.createUser));

userRoute.get('/getByEmail', wrapRequestHandler(userController.getUserByEmail));

userRoute.get('/getAll', wrapRequestHandler(userController.getAllUsers));

userRoute.put('/updateUser/:id', wrapRequestHandler(userController.updateUser));

export default userRoute