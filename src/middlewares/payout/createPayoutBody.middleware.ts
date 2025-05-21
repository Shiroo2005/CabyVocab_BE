import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'

export const validateCreatePayout = validate(
  checkSchema({
    amount: {
      in: ['body'],
      isFloat: {
        options: { gt: 0 },
        errorMessage: 'amount phải là số lớn hơn 0'
      },
      exists: {
        errorMessage: 'Trường amount là bắt buộc'
      }
    },

    numberAccount: {
      in: ['body'],
      isString: {
        errorMessage: 'numberAccount phải là chuỗi'
      },
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'numberAccount phải từ 6 đến 20 ký tự'
      },
      exists: {
        errorMessage: 'Trường numberAccount là bắt buộc'
      }
    },

    nameBank: {
      in: ['body'],
      isString: {
        errorMessage: 'nameBank phải là chuỗi'
      },
      notEmpty: {
        errorMessage: 'nameBank không được để trống'
      },
      exists: {
        errorMessage: 'Trường nameBank là bắt buộc'
      }
    }
  })
)
