// tests/auth/login.test.ts
import request from 'supertest'
import express from 'express'
import { DatabaseService } from '~/services/database.service'
import { User } from '~/entities/user.entity'
import { Role } from '~/entities/role.entity'
import authRouter from '~/routes/auth.route'
import { UserData } from '../data/user.data'
import { hashData } from '~/utils/jwt'
import { ErrorMessage } from 'tests/constants/error.message'
import { errorHandler } from '~/utils/handler'
import { app } from 'tests/app'
import { SuccessMessage } from 'tests/constants/success.message'
import { RefreshToken } from '~/entities/token.entity'

// 1. Mock DatabaseService
jest.mock('~/services/database.service')

// 2. Tạo mock function
const mockFindOne = jest.fn(async (query: any): Promise<User | null> => {
  if (query.where.username === UserData.validUser.username || query.where.email === UserData.validUser.email) {
    return {
      id: 1,
      username: UserData.validUser.username,
      role: { name: 'ADMIN' } as Role,
      password: hashData(UserData.validUser.password),
      email: UserData.validUser.email
    } as User
  }
  return null
})

// 3. Khi getRepository gọi, trả về object có findOne là mock
;(DatabaseService.getInstance as jest.Mock).mockReturnValue({
  getRepository: jest.fn().mockResolvedValue({
    findOne: mockFindOne
  })
})

jest.spyOn(RefreshToken, 'save').mockImplementation(async (data) => {
  return data as any
})

// 5. Tests
describe('Login route test with mocked repository', () => {
  //006
  it('LOGIN 006 - Username and Password are empty should throw error', async () => {
    const res = await request(app).post('/auth/login').send({ username: '', password: '' })

    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(ErrorMessage.MSG1)
  })

  //007
  it('LOGIN 007 - user does not exist with given username should throw error', async () => {
    const wrongUser = UserData.invalidUser
    const res = await request(app)
      .post('/auth/login')
      .send({ username: wrongUser.username, password: wrongUser.password })

    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(ErrorMessage.MSG11)
  })

  //008
  it('LOGIN 008 - user exist but given password not correct should throw error', async () => {
    const validUser = UserData.validUser
    const wrongPassword = UserData.dumbUser.password

    const res = await request(app).post('/auth/login').send({ username: validUser.username, password: wrongPassword })

    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(ErrorMessage.MSG11)
  })

  //012
  it('LOGIN 012 - successful login API should return JWT token.', async () => {
    const validUser = UserData.validUser

    const res = await request(app)
      .post('/auth/login')
      .send({ username: validUser.username, password: validUser.password })

    expect(res.status).toBe(200)
    expect(res.body.message).toEqual(SuccessMessage.LOGIN_SUCCESS)

    const accessToken = res.body.metaData.accessToken
    const refreshToken = res.body.metaData.refreshToken

    expect(accessToken).toBeTruthy()
    expect(refreshToken).toBeTruthy()
  })
})
