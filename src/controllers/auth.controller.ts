import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import passport from 'passport'
import { env } from 'process'
import { OAUTH_PROVIDER } from '~/constants/oauth'
import { BadRequestError } from '~/core/error.response'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { TokenPayload } from '~/dto/common.dto'
import { ChangePasswordBodyReq } from '~/dto/req/auth/changePasswordBody.req'
import { LogoutBodyReq } from '~/dto/req/auth/LogoutBody.req'
import { UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { User } from '~/entities/user.entity'
import { authService } from '~/services/auth.service'
import { isValidEnumValue } from '~/utils'

class AuthController {
  register = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const result = await authService.register(req.body)
    return new CREATED({
      message: 'Đăng kí tài khoản mới thành công',
      metaData: result
    }).send(res)
  }
  login = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = (req as any).user as User
    const result = await authService.login(user)
    return new SuccessResponse({
      message: 'Đăng nhập thành công',
      metaData: result
    }).send(res)
  }
  refreshToken = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const result = await authService.refreshToken(req.body)
    return new SuccessResponse({
      message: 'Refresh token thành công',
      metaData: result
    }).send(res)
  }
  getAccount = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const result = await authService.getAccount(req.decodedAuthorization as TokenPayload)
    return new SuccessResponse({
      message: 'Lấy thông tin tài khoản thành công',
      metaData: result
    }).send(res)
  }

  logout = async (req: Request<ParamsDictionary, any, LogoutBodyReq>, res: Response) => {
    const { refreshToken } = req.body
    return new SuccessResponse({
      message: 'Logout successful!',
      metaData: await authService.logout({ refreshToken })
    }).send(res)
  }

  sendVerificationEmail = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User
    await authService
      .sendVerifyEmail({ email: user.email, name: user.username, userId: user.id as number })
      .catch((err) => console.error('Error when send verify email', err))
      .then((res) => {
        console.log(`Send verification email successful with url = ${res}`)
        return
      })

    return new SuccessResponse({ message: 'Send verification email successful!' }).send(res)
  }

  verifyEmailTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Verify email!',
      metaData: await authService.verifyEmail({ userId: user.id as number })
    }).send(res)
  }

  updateProfile = async (req: Request<ParamsDictionary, any, UpdateUserBodyReq>, res: Response) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Update profile successful',
      metaData: await authService.changeProfile(user.id as number, req.body)
    }).send(res)
  }

  oauthLoginController = async (req: Request, res: Response) => {
    const provider = req.params.provider
    console.log(provider)

    if (!provider || !isValidEnumValue(provider, OAUTH_PROVIDER))
      throw new BadRequestError({ message: 'Provider invalid!' })

    passport.authenticate(provider, { scope: ['profile', 'email'], session: false })(req, res)
  }

  oauthLoginCallbackController = async (req: Request, res: Response) => {
    const provider = req.params.provider
    if (!provider || !isValidEnumValue(provider, OAUTH_PROVIDER))
      throw new BadRequestError({ message: 'Provider invalid!' })
    passport.authenticate(provider, { session: false }, async (err: any, user: User, info: any) => {
      if (err || !user) {
        throw new BadRequestError({ message: 'Login failed!' })
      }

      const { accessToken, refreshToken } = await authService.login({
        id: user.id as number
      } as User)
      const FE_URL = env.FE_URL as string
      res.redirect(`${FE_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    })(req, res)
  }

  changePassword = async (req: Request<ParamsDictionary, any, ChangePasswordBodyReq>, res: Response) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Change password for user successful',
      metaData: await authService.changePasswordForUser(user, req.body)
    }).send(res)
  }
}
export const authController = new AuthController()
