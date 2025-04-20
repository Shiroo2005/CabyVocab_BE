import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { createRandomUser } from '~/core/data/user.data'
import { DeepPartial } from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { Word } from '~/entities/word.entity'
import { wordSeedData } from '~/core/data/word.data'
import { Topic } from '~/entities/topic.entity'
import { topicSeedData } from '~/core/data/topic.data'

async function seedRole() {
  const count = await Role.count()
  if (count != 0) {
    console.log('Role already exits')
    return
  }
  console.log('Creating ADMIN role...')
  const roles = [
    {
      name: 'ADMIN',
      description: 'Administrator with full access'
    },
    {
      name: 'USER',
      description: 'Regular user with limited access'
    },
    {
      name: 'PREMIUM',
      description: 'Premium user with additional features'
    }
  ] as Role[]

  await Role.save(roles)
  console.log('Created sample role .......')
}

async function seedUsers() {
  const count = await User.count({}) // Kiểm tra xem có dữ liệu chưa

  const adminRole = (await Role.findOne({ where: { name: 'ADMIN' } })) as Role
  const userRole = (await Role.findOne({ where: { name: 'USER' } })) as Role

  if (count === 0) {
    const data = [
      {
        email: 'Admin001@gmail.com',
        // fullName: 'Admin001',
        password: 'Admin123',
        role: adminRole,
        username: 'Admin001',
        status: UserStatus.VERIFIED
      } as User,
      {
        email: 'User001@gmail.com',
        // fullName: 'User001',
        password: 'User1123',
        role: userRole,
        username: 'User001',
        status: UserStatus.VERIFIED
      } as User,
      ...createRandomUser()
    ]

    await User.getRepository().save(data.map((item) => User.create(item)))

    console.log('✅ Seeded Users successfully!')
  } else {
    console.log('ℹ️ Users already exist, skipping seed...')
  }
}

async function seedWords() {
  const count = await Word.count()
  if (count > 0) {
    console.log('ℹ️ Words already exist, skipping seed...')
    return
  }
  console.log('✅ Seeded Words successfully!')

  return await Word.save(wordSeedData)
}

async function seedTopics() {
  const count = await Topic.count()
  if (count > 0) {
    console.log('ℹ️ Topics already exist, skipping seed...')
    return
  }
  const words = await seedWords()
  if (!words) return

  await Topic.save(topicSeedData(words))
  console.log('✅ Seeded Topics successfully!')
}
export async function seedInitialData() {
  await seedRole()
  await seedUsers()
  await seedTopics()

  console.log('Initial data setup complete')
}
