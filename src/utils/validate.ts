import { body } from 'express-validator'
import { ValidationError } from 'sequelize'
import { Regex } from '~/constants/regex'

export const convertValidateErr = (err: ValidationError) => {
  const errorFields = err.errors.map((e) => ({
    field: e.path,
    message: e.message
  }))

  return errorFields
}

export const registerValidation = [
  body('email')
    .matches(Regex.EMAIL)
    .withMessage('Email không hợp lệ'),
  body('username')
    .isLength({ min: 5, max: 20 })
    .withMessage('Username phải có độ dài từ 5 đến 20 ký tự'),
  body('password')
    .matches(Regex.PASSWORD)
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ hoa!'),
  body('full_name')
   .matches(Regex.NAME)
   .withMessage('Full name phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ cái!')
]

export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email hoặc username không được để trống')
    .custom((value) => {
      // Allow either email format or username format
      return Regex.EMAIL.test(value) || 
        (value.length >= 5 && value.length <= 20);
    })
    .withMessage('Email hoặc username không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
]
