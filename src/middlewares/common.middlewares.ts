import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { BadRequestError } from '~/core/error.response'
import { isValidNumber } from '~/utils'

export const checkIdParamMiddleware = (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  if (req.params?.id && !isValidNumber(req.params?.id)) {
    throw new BadRequestError({ message: 'Id invalid!' })
  } else next()
}


export const isRequired = (fieldName: string) => ({
  notEmpty: {
    errorMessage: `${fieldName} is required`
  }
})

export const isEmail = {
  isEmail: {
    errorMessage: 'Invalid email format'
  },
  normalizeEmail: true
}

export const isPassword = {
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 1
    },
    errorMessage: 'Password must be at least 6 characters, 1 upper case'
  }
}

export const isUsername = {
  isLength: {
    options: { min: 6 },
    errorMessage: 'Username must be at least 6 characters'
  },
  matches: {
    options: /^[a-zA-Z0-9]+$/,
    errorMessage: 'Only letters and numbers are allowed'
  }
}

export const isLength = ({ fieldName, min = 6, max = 30 }: { fieldName: string; min?: number; max?: number }) => ({
  isLength: {
    options: {
      min,
      max
    },
    errorMessage: `${fieldName} length must be between ${min} and ${max}`
  }
})

export const isString = (fieldName: string) => {
  return {
    isString: {
      errorMessage: `${fieldName} must be a string!`
    }
  }
}

export const isEnum = <Enum extends Record<string, string | number>>(enumObj: Enum, fieldName = 'Value') => ({
  custom: {
    options: (value: any) => {
      const enumValues = Object.values(enumObj);
      if (!enumValues.includes(value)) {
        throw new Error(`${fieldName} must be one of: ${enumValues.join(', ')}`);
      }
      return true;
    }
  }
});
