import { checkSchema } from 'express-validator'
import { isEmail, isLength, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { validate } from '../validation.middlewares'
import { User } from '~/entities/user.entity'
import { UserStatus } from '~/constants/userStatus'
import { Role } from '~/entities/role.entity'
import { Request } from 'express'
import { toNumber } from 'lodash'

export const updateUserByIdValidation = validate(
  checkSchema({
    username: {
      optional: true,
      ...isUsername,
      ...isLength({ fieldName: 'username' })
    },

    email: {
      optional: true,
      ...isEmail,
      custom: {
        options: async (value, { req }) => {
          const foundUser = await User.findOne({
            where: [{ email: value }, { username: req.body.username }]
          })

          if (foundUser && (foundUser.id as number) != toNumber((req as Request).params.id)) {
            throw new BadRequestError({ message: 'Email or username already in!' })
          }

          return true
        }
      }
    },

    avatar: {
      optional: true,
      trim: true
    },

    status: {
      optional: true,
      trim: true,
      isIn: {
        options: [Object.values(UserStatus)]
      }
    },

    roleId: {
      optional: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const foundRole = await Role.findOne({
            where: {
              id: value
            }
          })

          if (!foundRole) {
            throw new BadRequestError({ message: 'Role not exists!' })
          }

          return true
        }
      }
    }
  })
)
