import { Like } from 'typeorm'
import { BadRequestError } from '~/core/error.response'
import { CreateUserBodyReq, UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { userQueryReq } from '~/dto/req/user/userQuery.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'

class UserService {
  createUser = async ({ email, username, password, roleId, avatar }: CreateUserBodyReq) => {
    const role = await Role.findOne({
      where: { id: roleId }
    })
    if (!role) {
      throw new Error('Role not found!')
    }

    const createUser = User.create({
      email,
      username,
      password,
      role,
      avatar: avatar || 'N/A'
    })

    return unGetData({ fields: ['password'], object: await User.save(createUser) })
  }

  getUserByEmail = async (email: string) => {
    const resUser = await User.findOne({
      where: {
        email
      },
      relations: ['role'],
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
        streak: true,
        lastStudyDate: true,
        totalStudyDay: true,
        role: { name: true }
      }
    })
    console.log(resUser)

    return resUser || {}
  }

  getAllUser = async ({ page = 1, limit = 10, email, username, roleName, status, sort }: userQueryReq) => {
    const skip = (page - 1) * limit
    const [users, total] = await User.findAndCount({
      skip,
      take: limit,
      relations: ['role'],
      where: {
        email: Like(`%${email || ''}%`),
        username: Like(`%${username || ''}%`),
        role: { name: roleName },
        status
      },
      order: sort,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
        streak: true,
        lastStudyDate: true,
        totalStudyDay: true,
        role: { name: true, id: true }
      }
    })
    return {
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  getUserByID = async (id: number) => {
    const user = await User.findOne({
      where: {
        id
      },
      relations: ['role'],
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
        streak: true,
        lastStudyDate: true,
        totalStudyDay: true,
        role: { name: true, id: true }
      }
    })

    return user || {}
  }

  updateUserByID = async (id: number, { username, email, avatar, status, roleId }: UpdateUserBodyReq) => {
    const user = await User.findOne({
      where: { id },
      relations: ['role']
    })

    if (!user) {
      throw new Error('Không tìm thấy user')
    }

    let role

    if (roleId) {
      const userRole = await Role.findOne({ where: { id: roleId } })
      role = userRole != null ? userRole : undefined
    }

    const updatedUser = User.updateUser(user, {
      username,
      email,
      avatar,
      status,
      role
    })

    // Save the updated user to the database
    await User.save(updatedUser)

    return unGetData({
      fields: ['password', 'role.createdAt', 'role.updatedAt', 'role.deletedAt', 'role.description'],
      object: updatedUser
    })
  }

  deleteUserByID = async (id: number) => {
    return await User.getRepository().softDelete(id)
  }

  restoreUser = async (id: number) => {
    return User.getRepository().restore(id)
  }

  updateBalance = async (userId: number, increaseBalance: number) => {
    const foundUser = await User.findOne({
      where: {
        id: userId
      }
    })

    if (!foundUser) throw new BadRequestError({ message: 'User not found' })

    //update balance
    foundUser.balance += increaseBalance

    foundUser.save()
  }
}

export const userService = new UserService()
