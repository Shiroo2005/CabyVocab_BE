import { User } from '~/entities/user.entity'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'
import { TokenPayload } from '~/dto/common.dto'
import { Token } from '~/entities/token.entity'
import { unGetData } from '~/utils'
import { LogoutBodyReq } from '~/dto/req/auth/LogoutBody.req'
import { sendVerifyEmail } from './email.service'
import { EmailVerificationToken } from '~/entities/emailVerificationToken.entity'
import { UserStatus } from '~/constants/userStatus'
dotenv.config()

class AuthService {
  register = async ({
    email,
    username,
    password
  }: {
    email: string
    username: string
    password: string
    fullName: string
  }) => {
    //create new user
    const newUser = User.create({
      email,
      username,
      password
      ///role
    })

    //await save user
    const createdUser = await User.save(newUser)

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: createdUser.id as number }),
      signRefreshToken({ userId: createdUser.id as number })
    ])

    //save token in db
    const newToken = Token.create({ refreshToken, user: newUser })
    await newToken.save()

    return {
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
    await Token.save({ refreshToken, user: user })

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
    await Token.save({ refreshToken: new_refreshToken, user: { id: userId } as User })

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
    return { user: unGetData({ fields: ['password'], object: user }) }
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    const result = await Token.getRepository().softDelete({ refreshToken })

    return result
  }

  sendVerifyEmail = async ({ email, userId, name }: { email: string; userId: number; name: string }) => {
    //delete all code for user previously
    await EmailVerificationToken.getRepository().softDelete({ user: { id: userId } })

    //send email
    const code = await sendVerifyEmail({ to: email, template: 'welcome', body: { name, userId } })

    //save email token
    const emailToken = EmailVerificationToken.create({ code, user: { id: userId } })
    await EmailVerificationToken.save(emailToken)

    return code
  }

  verifyEmail = async ({ userId }: { userId: number }) => {
    //set status user in db
    await User.update(userId, { status: UserStatus.VERIFIED })

    //return info user before update
    return this.getAccount({ userId: userId })
  }
}

export const authService = new AuthService()
