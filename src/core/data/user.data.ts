import { User } from '~/entities/user.entity'
import { faker } from '@faker-js/faker'
import { UserStatus } from '~/constants/userStatus'
import { Role } from '~/entities/role.entity'
import _ from 'lodash'

const COUNT = 1000

const randomUser = () => {
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: 'User0000',
    role: { id: _.random(1, 3) } as Role,
    avatar: faker.image.avatar(),
    status: UserStatus.NOT_VERIFIED
  } as User
}

export const createRandomUser = (count?: number) => {
  if (!count || count < 0) count = COUNT
  return faker.helpers.multiple(randomUser, {
    count
  })
}
