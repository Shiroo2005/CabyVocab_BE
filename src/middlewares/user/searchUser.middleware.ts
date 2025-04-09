import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { roleService } from '~/services/role.service'
import { validate } from '../validation.middlewares'
import { User } from '~/entities/user.entity'

export const searchEmailValidation = validate (
  checkSchema({
    email: {
      in: ['query'],   
      ...isEmail,
      custom: {
        options: async (value, { req }) => {
          const foundUser = await User.findOne({
            where: [{ email: value }, { username: req.body.username }]
          })

          if (!foundUser) {
            throw new BadRequestError({ message: 'Email not exists' })
          }

          return true
        }
      }       
    }
  })
)