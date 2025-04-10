
import { error } from 'console'
import e from 'express'
import { stat } from 'fs'
import { CreateUserBodyReq, UpdateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'


class UserService {
  createUser = async ({ email, username, password, fullName }: CreateUserBodyReq) => {
    const createUser = User.create({ email, username, password, fullName })
    return unGetData({ fields: ['password'], object: await User.save(createUser) })
  }

  getUserByEmail = async (email: string) => {
    const resUser = await User.findOne({
      where: {
        email
      },
      select: ['id', 'email', 'username', 'fullName', 'avatar', 'status']
    })
    console.log(resUser);

    if (!resUser)
      throw new Error('Không tìm thấy user');

    return resUser
  }

  getAllUser = async(page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [users, total] = await User.findAndCount({
      skip,
      take: limit,
      select: ['id', 'username', 'email', 'fullName', 'avatar', 'status']
    });
    return {
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  getUserByID = async (id: number) => {
    const user = await User.findOne({
      where: {
        id,
      },
      select: ['id', 'username', 'email', 'fullName', 'avatar', 'status']
    })
    if(!user) 
      throw new Error('Không tìm thấy user');
    return user;
  }

  updateUserByID = async(id: number, {username, email, fullName, avatar, status, roleId} : UpdateUserBodyReq) => {
      const user = await User.findOne({
        where:{
          id,
        }
      });
      if(!user) {
        throw new Error('Không tìm thấy user')
      }
      
      const resUser = User.updateUser(user, {username, email, fullName, avatar, status, roleId});
      
      await User.save(resUser);
      return unGetData({ fields: ['password'], object: await User.save(resUser) });
  }

  deleteUserByID = async(id: number) => {
    // const user = await User.findOne({
    //   where: {
    //     id,
    //   }
    // })
    // if(!user) {
    //   throw new Error('Không tìm thấy user')
    // }
    // const res = await User.deleteUser(user);
    // return unGetData({ fields: ['password'], object: await User.save(res) })

    return await User.getRepository().softDelete(id);
  }

  restoreUser = async(id: number) => {
    return User.getRepository().restore(id);
  }
}

export const userService = new UserService()
