import { body, checkSchema } from 'express-validator'
import { Regex } from '~/constants/regex'

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
    },
    roleId: {
        notEmpty: true,
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
