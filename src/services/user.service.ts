import { Between, Like } from 'typeorm'
import { BadRequestError } from '~/core/error.response'
import { CreateUserBodyReq, UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { userQueryReq } from '~/dto/req/user/userQuery.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'
import { hashData } from '~/utils/jwt'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

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
      password: hashData(password),
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

  updateUserByID = async (
    id: number,
    { avatar, email, status, username, newPassword, oldPassword, roleId }: UpdateUserBodyReq
  ) => {
    const user = await User.findOne({
      where: { id },
      relations: ['role']
    })

    if (!user) {
      throw new Error('Không tìm thấy user')
    }

    //check old password
    let password = user.password
    if (oldPassword && newPassword) {
      if (!(await bcrypt.compare(oldPassword, password)))
        throw new BadRequestError({ message: 'Confirm password not match!' })
      password = hashData(newPassword) as string
    }

    if (avatar) user.avatar = avatar
    if (status) user.status = status
    if (email) user.email = email
    if (username) user.username = username
    user.password = password
    if (roleId)
      user.role = {
        id: roleId
      } as Role

    await user.save()

    return unGetData({
      fields: ['password', 'role.createdAt', 'role.updatedAt', 'role.deletedAt', 'role.description'],
      object: user
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

  async getUserStatistics() {
    const total = await this.getTotalUsers()
    const newUsers7Days = await this.getDailyNewUsers(7)
    const newUsers30Days = await this.getDailyNewUsers(30)
    const activeUsers7Days = await this.getDailyActiveUsers(7)
    const activeUsers30Days = await this.getDailyActiveUsers(30)

    return {
      total,
      newUsers7Days,
      newUsers30Days,
      activeUsers7Days,
      activeUsers30Days
    }
  }

  // ✅ Tổng số người dùng
  private async getTotalUsers(): Promise<number> {
    return await User.count()
  }

  // ✅ Người dùng đăng ký mới theo ngày (trong N ngày gần đây)
  private async getDailyNewUsers(days: number): Promise<{ date: string; count: number }[]> {
    const now = dayjs()
    const result: { date: string; count: number }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = now.subtract(i, 'day')
      const start = date.startOf('day').toDate()
      const end = date.endOf('day').toDate()

      const count = await User.count({
        where: {
          createdAt: Between(start, end)
        }
      })

      result.push({
        date: date.format('YYYY-MM-DD'),
        count
      })
    }

    return result
  }

  // ✅ Người dùng active theo ngày (trong N ngày gần đây)
  private async getDailyActiveUsers(days: number): Promise<{ date: string; count: number }[]> {
    const now = dayjs()
    const result: { date: string; count: number }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = now.subtract(i, 'day')
      const start = date.startOf('day').toDate()
      const end = date.endOf('day').toDate()

      const count = await User.count({
        where: {
          lastStudyDate: Between(start, end)
        }
      })

      result.push({
        date: date.format('YYYY-MM-DD'),
        count
      })
    }

    return result
  }
}

export const userService = new UserService()
