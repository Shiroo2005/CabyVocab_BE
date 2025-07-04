import { NextFunction, Request, Response } from 'express'
import { MoreThan } from 'typeorm'
import { MAX_REQUESTS_VERIFY_EMAIL_PER_HOUR_, TokenType } from '~/constants/token'
import { VerificationToken } from '~/entities/emailVerificationToken.entity'
import { User } from '~/entities/user.entity'

export const sendVerificationEmailValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as User

  // 1. Check rate limit for spam
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const recentRequests = await VerificationToken.count({
    where: { user: { id }, createdAt: MoreThan(oneHourAgo), type: TokenType.emailVerifyToken },
    withDeleted: true
  })
  if (recentRequests >= MAX_REQUESTS_VERIFY_EMAIL_PER_HOUR_) {
    throw new Error('Number of quest was more than MAX_REQUEST_ALLOW')
  }

  return next()
}
