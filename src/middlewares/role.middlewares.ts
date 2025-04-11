import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
import { Role } from '~/entities/role.entitity'
import { BadRequestError } from '~/core/error.response'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'

// Validate role creation data
export const validateCreateRole = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]{3,}$/)
    .withMessage('Name must contain at least 3 chars, 1 letter and only letter, number'),
  body('description').optional().isString(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new BadRequestError({ message: errors.array()[0].msg })
      }

      // Check if role with same name already exists
      const { name } = req.body
      const existingRole = await Role.findOne({ where: { name } })
      if (existingRole) {
        throw new BadRequestError({ message: 'Role with this name already exists' })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
]
// Validate role update data
export const validateUpdateRole = [
  param('id').isNumeric().withMessage('Invalid role ID'),
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]{3,}$/)
    .withMessage('Name must contain at least 3 chars, 1 letter and only letter, number'),
  body('description').optional().isString(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new BadRequestError({ message: errors.array()[0].msg }))
    }

    // Check if role exists
    const id = Number(req.params.id)
    const role = await Role.findOne({ where: { id } })
    if (!role) {
      return next(new BadRequestError({ message: 'Role not found' }))
    }

    // Check if updated name conflicts with existing role (excluding current role)
    const { name } = req.body
    const existingRole = await Role.findOne({ 
      where: { name },
    })
    
    if (existingRole && existingRole.id !== id) {
      return next(new BadRequestError({ message: 'Role with this name already exists' }))
    }

    next()
  }
]

// Check if role exists before fetching or deleting
export const checkRoleExists = [
  param('id').isNumeric().withMessage('Invalid role ID'),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new BadRequestError({ message: errors.array()[0].msg }))
    }

    const id = Number(req.params.id)
    const role = await Role.findOne({ where: { id } })
    if (!role) {
      return next(new BadRequestError({ message: 'Role not found' }))
    }
    next()
  }
]

// Middleware to check if user has admin privileges
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  
  if (!user) {
    return next(new BadRequestError({ message: 'Access denied. Authentication required' }))
  }
  
  if (!user.role || user.role.name !== 'ADMIN') {
    return next(new BadRequestError({ message: 'Access denied. Admin privileges required' }))
  }
  
  if (user.status !== UserStatus.VERIFIED) {
    return next(new BadRequestError({ message: 'Access denied. Account not verified' }))
  }
  
  next()
}

// Validate pagination parameters
export const validatePagination = [
  (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query
    
    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
      return next(new BadRequestError({ message: 'Page must be a positive integer' }))
    }
    
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
      return next(new BadRequestError({ message: 'Limit must be a positive integer' }))
    }
    
    next()
  }
]