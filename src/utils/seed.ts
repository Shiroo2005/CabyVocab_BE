import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { createRandomUser } from '~/core/data/user.data'
import { DeepPartial } from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { Word } from '~/entities/word.entity'
import { wordSeedData } from '~/core/data/word.data'
import { Topic } from '~/entities/topic.entity'
import { topicSeedData } from '~/core/data/topic.data'
import { Course } from '~/entities/courses.entity'
import { courseSeedData } from '~/core/data/course.data'
import { WordTopic } from '~/entities/wordTopic.entity'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { hashData } from './jwt'

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
        password: hashData('Admin123'),
        role: adminRole,
        username: 'Admin001',
        status: UserStatus.VERIFIED
      } as User,
      {
        email: 'User001@gmail.com',
        // fullName: 'User001',
        password: hashData('User1123'),
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

  console.log('✅ Seeded Topics successfully!')
  const topics = await Topic.save(topicSeedData(words))

  //save topic word
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    const wordIds = (topic.wordTopics as WordTopic[]).map((item) => item.wordId) || []

    // Handle word associations
    if (wordIds && wordIds.length > 0) {
      // Create word-topic associations in bulk
      const wordTopics = wordIds.map((wordId) => ({
        topicId: topic.id as number,
        wordId: wordId
      })) as WordTopic[]

      await WordTopic.save(wordTopics)
    }
  }

  return topics
}

async function seedCourse() {
  const count = await Course.count()
  if (count > 0) {
    console.log('ℹ️ Courses already exist, skipping seed...')
    return
  }
  const topics = await seedTopics()
  if (!topics) return

  const courses = await Course.save(courseSeedData(topics))

  for (let index = 0; index < courses.length; index++) {
    const course = courses[index]
    const { courseTopics } = course
    await CourseTopic.save(
      courseTopics.map((item) => {
        return {
          ...item,
          course: {
            id: course.id
          }
        } as CourseTopic
      })
    )
  }
  console.log('✅ Seeded Course successfully!')
}

export async function seedInitialData() {
  await seedRole()
  await seedUsers()
  await seedCourse()

  console.log('Initial data setup complete')
}
