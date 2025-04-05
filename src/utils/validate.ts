import { body } from 'express-validator'
import { Regex } from '~/constants/regex'

export const registerValidation = [
  body('email').matches(Regex.EMAIL).withMessage('Email không hợp lệ'),
  body('username').isLength({ min: 5, max: 20 }).withMessage('Tên đăng nhập phải có độ dài từ 5 đến 20 ký tự'),
  body('password').matches(Regex.PASSWORD).withMessage('Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ hoa!'),
  body('fullName').isLength({ min: 5, max: 20 }).withMessage('Full name phải có độ dài từ 5 đến 20 ký tự')
]

export const loginValidation = [
  body('username').notEmpty().withMessage('Tên đăng nhập không được để trống'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
]
