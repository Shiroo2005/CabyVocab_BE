import { checkSchema } from 'express-validator'
import { Regex } from '~/constants/regex'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import jwt from 'jsonwebtoken'
import { validate } from '../validation.middlewares'
import { verifyToken } from '~/utils/jwt'
import { env } from 'process'
import { TokenPayload } from '~/dto/common.dto'
import { Request } from 'express'

export const registerValidation = checkSchema({
  email: {
    notEmpty: true,
    matches: {
      options: Regex.EMAIL,
      errorMessage: 'Email không hợp lệ'
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

export const loginValidation = checkSchema({
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
  }
})

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
            if (accessToken.length == 0) throw new AuthRequestError('Access token invalid!')
            try {
              const decodedAuthorization = (await verifyToken({
                token: accessToken,
                secretKey: env.JWT_ACCESS_SECRET as string
              })) as TokenPayload
              ;(req as Request).decodedAuthorization = decodedAuthorization
            } catch (error) {
              if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestError({
                  message: 'Access token is expired'
                })
              }
              throw new BadRequestError({
                message: 'Invalid access token'
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
