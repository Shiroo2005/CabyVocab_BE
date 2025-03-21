import { ValidationError } from 'sequelize'

export const convertValidateErr = (err: ValidationError) => {
  const errorFields = err.errors.map((e) => ({
    field: e.path,
    message: e.message
  }))

  return errorFields
}
