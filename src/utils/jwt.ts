import bcrypt from 'bcrypt'

export const hashData = (data: string) => {
  return bcrypt.hashSync(data, 10)
}
