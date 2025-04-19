import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { UserStatus } from '~/constants/userStatus'
import { Token } from '~/entities/token.entity'
import { signAccessToken, signRefreshToken } from './jwt'

export async function seedInitialData() {
  console.log('Checking for initial data...')

  // Check if ADMIN role exists
  const adminRole = await Role.findOne({ where: { name: 'ADMIN' } })

  // Create ADMIN role if it doesn't exist
  if (!adminRole) {
    console.log('Creating ADMIN role...')
    const role = new Role()
    role.name = 'ADMIN'
    role.description = 'Administrator with full access'
    await role.save()
    console.log('ADMIN role created successfully')
  }

  // Check if USER role exists
  const userRole = await Role.findOne({ where: { name: 'USER' } })

  // Create USER role if it doesn't exist
  if (!userRole) {
    console.log('Creating USER role...')
    const role = new Role()
    role.name = 'USER'
    role.description = 'Regular user with limited access'
    await role.save()
    console.log('USER role created successfully')
  }

  // Check if PREMIUM role exists
  const premiumRole = await Role.findOne({ where: { name: 'PREMIUM' } })

  // Create PREMIUM role if it doesn't exist
  if (!premiumRole) {
    console.log('Creating PREMIUM role...')
    const role = new Role()
    role.name = 'PREMIUM'
    role.description = 'Premium user with additional features'
    await role.save()
    console.log('PREMIUM role created successfully')
  }

  // Check if admin user exists
  const adminUser = await User.findOne({
    where: { username: 'admin01' },
    relations: ['role']
  })

  // Create admin user if it doesn't exist
  if (!adminUser) {
    console.log('Creating admin user...')
    const role = await Role.findOne({ where: { name: 'ADMIN' } })

    if (!role) {
      throw new Error('ADMIN role not found')
    }

    const user = User.create({
      username: 'admin01',
      email: 'admin01@gmail.com',
      password: 'Admin01',
      status: UserStatus.VERIFIED,
      role: role
    })

    const savedUser = await user.save()
    console.log('Admin created successfully')

    // Generate tokens for the admin user
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: savedUser.id as number }),
      signRefreshToken({ userId: savedUser.id as number })
    ])

    // Save refresh token in database
    const newToken = Token.createToken({ refreshToken, user: savedUser })
    await newToken.save()

    console.log('Admin tokens created successfully')
  } else {
    console.log('Admin user already exists')
  }

  console.log('Initial data setup complete')
}
