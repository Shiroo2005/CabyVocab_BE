import { User } from '~/entities/user.entity'
import bcrypt from 'bcrypt'
import { BadRequestError } from '~/core/error.response'
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
    if (!email || !username || !password || !fullName) {
      throw new BadRequestError({ message: 'Thiếu thông tin cần thiết' })
    }

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

    //create new user
    const newUser = await User.save({
      email,
      username,
      password,
      fullName
    })
    return {
      user: newUser
    }
  }

  login = async ({ username, password }: { username: string; password: string }) => {
    if (!username || !password) {
      throw new BadRequestError({ message: 'Thiếu thông tin cần thiết' })
    }

    //find user by email or username
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (!user) {
      throw new BadRequestError({ message: 'Người dùng không tồn tại' })
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new BadRequestError({ message: 'Mật khẩu sai' })
    }
    //return user without password
    return {
      user
    }
  }
}

export const authService = new AuthService()
