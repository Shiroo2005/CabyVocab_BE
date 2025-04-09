
import { error } from 'console'
import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'


class UserService {
  createUser = async ({ email, username, password, fullName }: CreateUserBodyReq) => {
    const createUser = User.create({ email, username, password, fullName })
    return unGetData({ fields: ['password'], object: await User.save(createUser) })
  }

  //typeORM
  getUserByEmail = async (email: string) => {
    const resUser = await User.findOne({
      where: {
        email
      },
      select: ['id', 'email', 'username', 'fullName', 'avatar', 'status']
    })
    console.log(resUser);
    if (!resUser) return {}
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
    if(!user) return {};
    return user;
  }

    // loi do dung sequelizelize
    updateUser = async(userID: string, newData: Partial<User>) => {
        // const user = await User.findByPk(userID);
        // if (!user) {
        //   throw new Error('Không tìm thấy User');
        // }
        // await user.update(newData);
        // return user;
    }

    deleteUserByEmail = async() => {

    }

    changeStatusForUser = async() => {

    }
}

export const userService = new UserService()
