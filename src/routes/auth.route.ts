import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
import {
  accessTokenValidation,
  changePasswordValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  verifyEmailTokenValidation
} from '~/middlewares/auth.middlewares'
import { updateUserByIdValidation } from '~/middlewares/user/updateUser.middleware'
const authRouter = express.Router()

// GET

authRouter.put('/change-password', changePasswordValidation, wrapRequestHandler(authController.changePassword))

// POST
authRouter.post('/register', registerValidation, wrapRequestHandler(authController.register))
authRouter.post('/login', loginValidation, wrapRequestHandler(authController.login))
authRouter.post('/refresh', refreshTokenValidation, wrapRequestHandler(authController.refreshToken))
authRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(authController.logout))

authRouter.use(accessTokenValidation)

authRouter.get('/account', accessTokenValidation, wrapRequestHandler(authController.getAccount))

/**
 * @description : Verify email token
 * @method : POST
 * @path : /verify-email
 * @body : {token}
 */
authRouter.post(
  '/verify-email',
  verifyEmailTokenValidation,
  wrapRequestHandler(authController.verifyEmailTokenController)
)

// PUT
/**
 * @description : Update profile
 * @method : POST
 * @path : /profile
 */
authRouter.put('/profile', updateUserByIdValidation, wrapRequestHandler(authController.updateProfile))

// DELETE
export default authRouter
