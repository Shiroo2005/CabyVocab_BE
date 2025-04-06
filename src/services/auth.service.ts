import { User } from '~/entities/user.entity'
import bcrypt from 'bcrypt'
import { BadRequestError } from '~/core/error.response'
import { generateTokens, hashData } from '~/utils/jwt'
import { Role } from '~/entities/role.entitity'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

class AuthService {
  register = async ({
    email,
    username,
    password,
    fullName,
    roleId
  }: {
    email: string
    username: string
    password: string
    fullName: string,
    roleId: number
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
      fullName,
      ///role
    })
    const { password: _password, ...userWithoutPassword } = await newUser.save()
    const tokens = generateTokens(userWithoutPassword.id!)
    return {
      user: userWithoutPassword,
      ...tokens
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
    const tokens = generateTokens(userWithoutPassword.id!)
    return {
      user: userWithoutPassword,
      ...tokens
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
    const tokens = generateTokens(user.id!)
    return tokens
  }

  getAccount = async ({ accessToken }: { accessToken: string }) => {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as { userId: number }
    const user = await User.findOne({
      where: {
        id: decoded.userId
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
