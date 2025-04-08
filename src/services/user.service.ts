import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'

class UserService {
  createUser = async ({ email, username, password, fullName }: CreateUserBodyReq) => {
    const createUser = User.create({ email, username, password, fullName })

    return unGetData({ fields: ['password'], object: await User.save(createUser) })
  }

  getUserByEmail = async ({ email }: { email: string }) => {
    const resUser = await User.findOne({
      where: {
        email
      },
      select: ['id', 'email', 'username', 'fullName', 'avatar', 'status']
    })
    if (!resUser) return {}
    return resUser
  }

  updateUser = async () => {}
}

export const userService = new UserService()
