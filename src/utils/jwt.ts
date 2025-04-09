import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from 'process'
import { v4 as uuidv4 } from 'uuid'
import { TokenType } from '~/constants/tokenType'

config()

const JWT_ACCESS_SECRET = env.JWT_ACCESS_SECRET as string
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET as string

export const hashData = (data: string) => {
  return bcrypt.hashSync(data, 10)
}

export const signToken = ({
  payload,
  secretKey,
  optional
}: {
  payload: string | Buffer | object
  optional?: SignOptions
  secretKey: string
}) => {
  optional = { ...optional, algorithm: 'HS256' }
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, { ...optional, jwtid: uuidv4() }, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token as string)
    })
  })
}

export const signAccessToken = async ({ userId }: { userId: number }) => {
  return await signToken({
    payload: { userId, tokenType: TokenType.accessToken },
    optional: { expiresIn: env.JWT_ACCESS_EXPIRE_TIME as string },
    secretKey: JWT_ACCESS_SECRET
  })
}

export const signRefreshToken = async ({ userId, exp }: { userId: number; exp?: number }) => {
  if (exp) {
    return await signToken({
      payload: { userId, exp, tokenType: TokenType.refreshToken },
      secretKey: JWT_REFRESH_SECRET
    })
  }

  return await signToken({
    payload: { userId, tokenType: TokenType.refreshToken },
    optional: { expiresIn: env.JWT_REFRESH_EXPIRE_TIME as string },
    secretKey: JWT_REFRESH_SECRET
  })
}

export const verifyToken = async ({ token, secretKey }: { token: string; secretKey: string }) => {
  return jwt.verify(token, secretKey)
}
