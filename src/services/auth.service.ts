import { User } from '~/entities/user.entity'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'
import { TokenPayload } from '~/dto/common.dto'
import { Token } from '~/entities/token.entity'
import { unGetData } from '~/utils'
import { LogoutBodyReq } from '~/dto/req/auth/LogoutBody.req'
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

  getAccount = async ({ userId }: TokenPayload) => {
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
}

export const authService = new AuthService()
