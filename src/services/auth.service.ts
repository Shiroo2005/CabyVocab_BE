import { User } from '~/entities/user.entity'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { hashData, signAccessToken, signRefreshToken } from '~/utils/jwt'
import { RefreshToken } from '~/entities/token.entity'
import { generateUniqueUsername, unGetData } from '~/utils'
import { LogoutBodyReq } from '~/dto/req/auth/LogoutBody.req'
import { sendChangePassword, sendVerifyEmail } from './email.service'
import { VerificationToken } from '~/entities/emailVerificationToken.entity'
import { UserStatus } from '~/constants/userStatus'
import { Role } from '~/entities/role.entity'
import { UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { BadRequestError } from '~/core/error.response'
import bcrypt from 'bcrypt'
import { TokenType } from '~/constants/token'
import { generateVerificationCode } from '~/utils/email'
import eventBus from '~/events-handler/eventBus'
import { EVENTS } from '~/events-handler/constants'

dotenv.config()

class AuthService {
  register = async ({
    email,
    username,
    password,
    isVerified = false
  }: {
    email: string
    username: string
    password: string
    isVerified?: boolean
  }) => {
    // Find the USER role
    const userRole = await Role.findOne({ where: { name: 'USER' } })

    if (!userRole) {
      throw new Error('USER role not found')
    }

    const status = isVerified ? UserStatus.VERIFIED : UserStatus.NOT_VERIFIED

    //create new user
    const newUser = User.create({
      email,
      username,
      password: hashData(password),
      role: userRole,
      status
    })

    //await save user
    const createdUser = await User.save(newUser)

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: createdUser.id as number }),
      signRefreshToken({ userId: createdUser.id as number })
    ])

    //save token in db
    const newToken = RefreshToken.create({ refreshToken, user: newUser })
    await newToken.save()

    this.sendVerifyEmail({ email, name: username, userId: createdUser.id as number }).catch((ex) => {
      console.log('send email faild')
    })

    return {
      user: unGetData({ fields: ['password'], object: createdUser }),
      accessToken,
      refreshToken
    }
  }

  login = async (user: User) => {
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user?.id as number }),
      signRefreshToken({ userId: user?.id as number })
    ])

    // save token in db
    await RefreshToken.save({ refreshToken, user: user })

    return {
      user: unGetData({ fields: ['password'], object: user }),
      accessToken,
      refreshToken
    }
  }

  refreshToken = async ({ refreshToken }: { refreshToken: string }) => {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: number }
    const userId = decodedToken.userId

    // create new tokens
    const [new_accessToken, new_refreshToken] = await Promise.all([
      signAccessToken({ userId }),
      signRefreshToken({ userId })
    ])

    //save refresh token into db
    await RefreshToken.save({ refreshToken: new_refreshToken, user: { id: userId } as User })

    return {
      accessToken: new_accessToken,
      refreshToken: new_refreshToken
    }
  }

  getAccount = async ({ userId }: { userId: number }) => {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['role']
    })

    if (!user) return {}
    return {
      user: unGetData({
        fields: ['password', 'role.createdAt', 'role.updatedAt', 'role.deletedAt', 'role.description'],
        object: user
      })
    }
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    const result = await RefreshToken.getRepository().softDelete({ refreshToken })

    return result
  }

  sendVerifyEmail = async ({ email, userId, name }: { email: string; userId: number; name: string }) => {
    //delete all code for user previously
    await VerificationToken.getRepository().softDelete({ user: { id: userId }, type: TokenType.emailVerifyToken })

    //send email
    const code = await sendVerifyEmail({ to: email, template: 'welcome', body: { name, userId } })

    //save email token
    const emailToken = VerificationToken.create({ code, user: { id: userId }, type: TokenType.emailVerifyToken })
    await VerificationToken.save(emailToken)

    return code
  }

  sendEmailChangePassword = async ({ email }: { email: string }) => {
    const code = generateVerificationCode()

    const foundUser = await User.findOneBy({ email })

    if (!foundUser) throw new BadRequestError({ message: 'email invalid!' })

    //delete all code for user previously
    await VerificationToken.getRepository().softDelete({
      user: { id: foundUser.id },
      type: TokenType.changePasswordToken
    })

    await sendChangePassword({
      to: email,
      body: { code, email },
      template: 'changePassword',
      subject: 'Change password verify'
    })

    //save email token
    const changePasswordToken = VerificationToken.create({
      code,
      user: { id: foundUser.id },
      type: TokenType.changePasswordToken
    })
    await VerificationToken.save(changePasswordToken)
  }

  verifyEmail = async ({ userId }: { userId: number }) => {
    //set status user in db
    await User.update(userId, { status: UserStatus.VERIFIED })

    //return info user before update
    return this.getAccount({ userId: userId })
  }

  changeProfile = async (id: number, { avatar, email, username }: UpdateUserBodyReq) => {
    // return await userService.updateUserByID(id, { avatar, email, username })
    return {}
  }

  /**Change password
   * @Step 1:validate old password must match
   * @Step 2: change new password
   * @Step 3: invalidate refresh token of user so far
   */
  changePasswordForUser = async (foundUser: User, { newPassword }: { newPassword: string }) => {
    if (!newPassword) throw new BadRequestError({ message: 'New Password invalid!' })
    //update new password
    // delete refresh token of this user before
    await Promise.all([
      this.updatePassword(foundUser, newPassword),
      this.deleteRefreshTokenByUser(foundUser.id as number),
      VerificationToken.getRepository().softDelete({ user: { id: foundUser.id }, type: TokenType.changePasswordToken })
    ])

    eventBus.emit(EVENTS.CHANGE_PASSWORD, { userId: foundUser.id })

    return {}
  }

  updatePassword = async (user: User, newPassword: string) => {
    user.password = hashData(newPassword)

    return await user.save()
  }

  validateChangePassword = async (foundUser: User, confirmPassword: string) => {
    //compare password
    if (!bcrypt.compare(confirmPassword, foundUser.password))
      throw new BadRequestError({ message: 'Confirm password not match!' })
  }

  deleteRefreshTokenByUser = async (userId: number) => {
    return await RefreshToken.getRepository().softDelete({
      user: {
        id: userId
      }
    })
  }

  loginByGoogle = async (email: string) => {
    const foundUser = await User.findOne({
      where: {
        email
      },
      relations: ['role']
    })

    if (!foundUser) {
      return await this.register({
        email,
        username: await generateUniqueUsername(email.split('@')[0]),
        password: email.split('@')[0],
        isVerified: true
      })
    }
    return await this.login(foundUser)
  }
}

export const authService = new AuthService()
