import { checkSchema } from 'express-validator'
import { Regex } from '~/constants/regex'
import { AuthRequestError, BadRequestError, ForbiddenRequestError } from '~/core/error.response'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validate } from './validation.middlewares'
import { verifyToken } from '~/utils/jwt'
import { env } from 'process'
import { TokenPayload } from '~/dto/common.dto'
import { NextFunction, Request, Response } from 'express'
import { DatabaseService } from '~/services/database.service'
import { User } from '~/entities/user.entity'
import { Role } from '~/entities/role.entity'
import { Token } from '~/entities/token.entity'
import { Permission, Query } from 'accesscontrol'
import { ac } from '~/config/access.config'
import { isRequired } from './common.middlewares'
import { EmailVerificationToken } from '~/entities/emailVerificationToken.entity'

async function checkUserExistence(userId: number) {
  const userRepository = await DatabaseService.getInstance().getRepository(User)
  const user = await userRepository.findOne({
    where: { id: userId }
  })
  if (!user) {
    throw new AuthRequestError('Không tồn tại người dùng')
  }
  return user
}

export async function checkRoleExistence(roleId: number) {
  const roleRepostiory = await DatabaseService.getInstance().getRepository(Role)
  const role = await roleRepostiory.findOne({
    where: { id: roleId }
  })
  if (!role) {
    throw new BadRequestError({ message: 'Vai trò không tồn tại' })
  }
}

async function checkDuplicateUser(email: string, username: string) {
  const userRepository = await DatabaseService.getInstance().getRepository(User)
  const existingUser = await userRepository.findOne({
    where: [{ email }, { username }]
  })
  if (existingUser) {
    throw new BadRequestError({ message: 'Người dùng đã tồn tại' })
  }
}

async function validateUserCredentials(username: string, password: string) {
  const userRepository = await DatabaseService.getInstance().getRepository(User)
  const user = await userRepository.findOne({
    where: { username },
    relations: ['role']
  })

  const isMatch = user ? await bcrypt.compare(password, user.password) : false
  if (!user || !isMatch) {
    throw new BadRequestError({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
  }
  return user
}

export const registerValidation = validate(
  checkSchema({
    email: {
      notEmpty: true,
      matches: {
        options: Regex.EMAIL,
        errorMessage: 'Email không hợp lệ'
      },
      custom: {
        options: async (value: string, { req }) => {
          await checkDuplicateUser(value, req.body.username)
          if (req.body.roleId) await checkRoleExistence(req.body.roleId)
          return true
        }
      }
    },
    username: {
      notEmpty: true,
      isLength: {
        options: {
          min: 5,
          max: 20
        },
        errorMessage: 'Tên đăng nhập phải có độ dài từ 5 đến 20 ký tự'
      }
    },
    password: {
      notEmpty: true,
      matches: {
        options: Regex.PASSWORD,
        errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ hoa!'
      }
    },
    fullName: {
      notEmpty: true,
      isLength: {
        options: {
          min: 5,
          max: 20
        },
        errorMessage: 'Full name phải có độ dài từ 5 đến 20 ký tự'
      }
    }
  })
)

export const loginValidation = validate(
  checkSchema({
    username: {
      notEmpty: true,
      isLength: {
        options: {
          min: 5,
          max: 20
        },
        errorMessage: 'Tên đăng nhập phải có độ dài từ 5 đến 20 ký tự'
      }
    },
    password: {
      notEmpty: true,
      matches: {
        options: Regex.PASSWORD,
        errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ hoa!'
      },
      custom: {
        options: async (value: string, { req }) => {
          const user = await validateUserCredentials(req.body.username, value)
          req.user = user
          return true
        }
      }
    }
  })
)

export const refreshTokenValidation = validate(
  checkSchema(
    {
      refreshToken: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Refresh token không được để trống'
        },
        custom: {
          options: async (value: string, { req }) => {
            if (value.length == 0) throw new AuthRequestError('Refresh token không hợp lệ')
            try {
              const decodedRefreshToken = (await verifyToken({
                token: value,
                secretKey: env.JWT_REFRESH_SECRET as string
              })) as TokenPayload

              // is token valid in db
              const foundToken = await Token.findOne({
                where: {
                  refreshToken: value
                }
              })

              if (!foundToken) throw new BadRequestError({ message: 'Refresh token invalid!' })

              // is id in decoded token valid ?
              await checkUserExistence(decodedRefreshToken.userId)
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
            } catch (error) {
              if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestError({
                  message: 'Refresh token hết hạn'
                })
              }
              throw new BadRequestError({
                message: 'Refresh token không hợp lệ'
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidation = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: 'Access token không được để trống'
        },
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (accessToken.length == 0) throw new AuthRequestError('Access token không hợp lệ')
            try {
              const decodedAuthorization = (await verifyToken({
                token: accessToken,
                secretKey: env.JWT_ACCESS_SECRET as string
              })) as TokenPayload

              // set User
              const { userId } = decodedAuthorization
              const foundUser = await User.findOne({
                where: {
                  id: userId
                },
                relations: ['role']
              })

              if (foundUser) {
                ;(req as Request).user = foundUser as User
                ;(req as Request).decodedAuthorization = decodedAuthorization
              }
            } catch (error) {
              if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestError({
                  message: 'Access token hết hạn'
                })
              }
              throw new BadRequestError({
                message: 'Access token không hợp lệ'
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const checkPermission = (action: keyof Query, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role) {
      throw new AuthRequestError('Unauthorized!')
    }
    const permission = ac.can(role.name)[action](resource) as Permission

    if (!permission.granted) {
      throw new ForbiddenRequestError('Forbidden!')
    }

    return next()
  }
}

export const verifyEmailTokenValidation = validate(
  checkSchema(
    {
      code: {
        ...isRequired('token'),
        isNumeric: true,
        custom: {
          options: async (code, { req }) => {
            const user = (req as Request).user

            if (!user) throw new BadRequestError({ message: 'Please log in again!' })
            //check is equaly
            const tokenInDb = await EmailVerificationToken.findOne({ where: { user: { id: user?.id } } })
            console.log(tokenInDb, code, tokenInDb != code)

            if (!tokenInDb || tokenInDb.code != code) throw new AuthRequestError('Wrong code')
            return true
          }
        }
      }
    },
    ['body']
  )
)
