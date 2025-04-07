import { User } from '~/entities/user.entity'
import bcrypt from 'bcrypt'
import { BadRequestError } from '~/core/error.response'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'
import { TokenPayload } from '~/dto/common.dto'
import { Token } from '~/entities/token.entity'
dotenv.config()

class AuthService {
  register = async ({
    email,
    username,
    password,
    fullName
  }: {
    email: string
    username: string
    password: string
    fullName: string
  }) => {
    //check if user exist by email or username
    const existingUser = await User.findOne({
      where: [
        {
          email
        },
        {
          username
        }
      ]
    })
    if (existingUser) {
      throw new BadRequestError({ message: 'Người dùng đã tồn tại' })
    }

    //find role
    // const role = await Role.findOne({
    //   where: {
    //     id: roleId
    //   }
    // })
    // if (!role) {
    //   throw new BadRequestError({ message: 'Vai trò không tồn tại' })
    // }

    //create new user
    const newUser = User.create({
      email,
      username,
      password,
      fullName
      ///role
    })
    const { password: _password, ...userWithoutPassword } = await newUser.save()
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: newUser.id as number }),
      signRefreshToken({ userId: newUser.id as number })
    ])

    const newToken = Token.create({refreshToken, user: newUser})
    await newToken.save()

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  login = async ({ username, password }: { username: string; password: string }) => {
    //find user by email or username
    const user = await User.findOne({
      where: {
        username
      }
    })
    //compare password
    const isMatch = user ? await bcrypt.compare(password, user.password) : false
    if (!user || !isMatch) {
      throw new BadRequestError({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
    }
    //return user without password
    const { password: _password, ...userWithoutPassword } = user
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id as number }),
      signRefreshToken({ userId: user.id as number })
    ])

    let userToken = await Token.findOne({
      where: {
        user: {
          id: user.id
        }
      }
    })
    if (userToken) {
      userToken.refreshToken = refreshToken
    } else {
      userToken = Token.create({refreshToken, user: user})
    }
    await userToken.save()

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  refreshToken = async ({ refreshToken }: { refreshToken: string }) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: number }
    const user = await User.findOne({
      where: {
        id: decoded.userId
      }
    })
    if (!user) {
      throw new BadRequestError({ message: 'Người dùng không tồn tại' })
    }
    const existingToken = await Token.findOne({
      where: {
        user: {
          id: user.id
        },
        refreshToken
      } 
    })
    if (!existingToken) {
      throw new BadRequestError({ message: 'Token không hợp lệ' }) 
    }
    const [new_accessToken, new_refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id as number }),
      signRefreshToken({ userId: user.id as number })
    ])
    existingToken.refreshToken = new_refreshToken
    await existingToken.save()
    return {
      accessToken: new_accessToken,
      refreshToken: new_refreshToken
    }
  }

  getAccount = async ({ userId }: TokenPayload) => {
    const user = await User.findOne({
      where: {
        id: userId
      },
      relations: ['role']
    })

    if (!user) {
      throw new BadRequestError({ message: 'Người dùng không tồn tại' })
    }

    const { password: _password, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword
    }
  }
}

export const authService = new AuthService()
