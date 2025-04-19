import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { roleService } from '~/services/role.service'
import { validate } from '../validation.middlewares'
import { User } from '~/entities/user.entity'
import { UserStatus } from '~/constants/userStatus'
import { isIn } from 'class-validator'
import { Role } from '~/entities/role.entity'

export const updateUserByIdValidation = validate (
  checkSchema({
    username: {
      trim: true,
      ...isUsername,
      ...isLength({ fieldName: 'username' })
    },

    email: {
      trim: true,
      ...isEmail,
      custom: {
        options: async (value, { req }) => {
          const foundUser = await User.findOne({
            where: [{ email: value }, { username: req.body.username }]
          })

          if (!foundUser) {
            throw new BadRequestError({ message: 'Email or username not exists!' })
          }

          return true
        }
      }
    },

    avatar: {
      trim: true,
    },

    status: {
      trim: true,
      isIn: {
        options: [Object.values(UserStatus)]
      }
    },

    roleId: {
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