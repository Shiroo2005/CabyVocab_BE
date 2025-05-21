import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { isEmpty } from 'lodash'
import { BadRequestError } from '~/core/error.response'
import { isValidNumber, toNumberWithDefaultValue } from '~/utils'

export const checkIdParamMiddleware = (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  if (req.params?.id && !isValidNumber(req.params?.id)) {
    throw new BadRequestError({ message: 'Id invalid!' })
  } else next()
}

export const checkQueryMiddleware = ({
  requiredFields,
  numbericFields = ['limit', 'page'],
  defaultLimit = 10,
  defaultPage = 1,
  maxLimit = 30
}: {
  requiredFields?: string[]
  numbericFields?: string[]
  defaultLimit?: number
  defaultPage?: number
  maxLimit?: number
} = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra xem có query nào không nằm trong fields không
    if (requiredFields) {
      const invalidFields = requiredFields.filter((field) => !req.query[field])

      if (invalidFields.length > 0) {
        throw new BadRequestError({ message: `${requiredFields.join(', ')} is required on query!` })
      }
    }

    // check is number field
    if (numbericFields) {
      numbericFields.forEach((field) => {
        if (req.query[field] && !isValidNumber(req.query[field] as string)) {
          throw new BadRequestError({ message: `${field} must be a numberic string` })
        }
      })
    }
    //parse limit, page
    req.parseQueryPagination = {
      limit: toNumberWithDefaultValue(req.query.limit, defaultLimit),
      page: toNumberWithDefaultValue(req.query.page, defaultPage)
    }

    if ((req.parseQueryPagination.page as number) <= 0) throw new BadRequestError({ message: 'Page invalid!' })
    if ((req.parseQueryPagination.limit as number) <= 0) throw new BadRequestError({ message: 'Limit invalid!' })

    //check max limit & max page
    if ((req.parseQueryPagination.limit as number) > maxLimit) req.parseQueryPagination.limit = defaultLimit
    next()
  }
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
      const enumValues = Object.values(enumObj)
      if (!enumValues.includes(value)) {
        throw new Error(`${fieldName} must be one of: ${enumValues.join(', ')}`)
      }
      return true
    }
  }
})

//pagination
//parse sort
export const parseSort = ({ allowSortList }: { allowSortList: string[] }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //convert sort to sort statement in typeorm
    // sort like sort =-id,+name

    const sort = req.query.sort as string | null

    const orderStatement: Record<string, 'ASC' | 'DESC'> = {}
    if (sort && !isEmpty(sort)) {
      const sortFields = sort.split(',')
      sortFields.forEach((sortField) => {
        const orderSort = sortField[0],
          fieldSort = sortField.substring(1)
        if (fieldSort && orderSort && allowSortList.includes(fieldSort)) {
          // Ensure the sort order is either ASC or DESC
          orderStatement[fieldSort] = orderSort === '-' ? 'DESC' : 'ASC'
        }
      })
      req.sortParsed = orderStatement
    }
    next()
  }
}
