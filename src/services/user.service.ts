import { CreateUserBodyReq, UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'


class UserService {
  createUser = async ({ email, username, password, fullName, roleId }: CreateUserBodyReq) => {
    const role = await Role.findOne({
      where: {id: roleId}
    });

    if (!role) {
      throw new Error('Role not found!');
    }
    const createUser = User.create({ email, username, password, role })
    return unGetData({ fields: ['password'], object: await User.save(createUser) }) 
  }

  getUserByEmail = async (email: string) => {
    const resUser = await User.findOne({
      where: {
        email
      },
      relations: ['role'],
      select: ['id', 'email', 'username', 'avatar', 'status', 'role']
    })
    console.log(resUser);

    return resUser || {}
  }

  getAllUser = async(page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [users, total] = await User.findAndCount({
      skip,
      take: limit,
      relations: ['role'],
      select: ['id', 'username', 'email', 'avatar', 'status', 'role']
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
      relations: ['role'],
      select: ['id', 'username', 'email', 'avatar', 'status']
    })

    return user ||{};
  }

  updateUserByID = async(id: number, {username, email, fullName, avatar, status, roleId} : UpdateUserBodyReq) => {
    const user = await User.findOne({
      where: { id },
      relations: ['role']
    });
  
    if (!user) {
      throw new Error('Không tìm thấy user');
    }
  
    let role
  
    if (roleId) {
      const userRole = await Role.findOne({ where: { id: roleId } });
      role = userRole != null ? userRole : undefined
    }
  
    const updatedUser = User.updateUser(user, {
      username,
      email,
      avatar,
      status,
      roleId,
      role
    });

    return unGetData({ fields: ['password'], object: updatedUser });
  }

  deleteUserByID = async(id: number) => {
    return await User.getRepository().softDelete(id);
  }

  restoreUser = async(id: number) => {
    return User.getRepository().restore(id);
  }
}

export const userService = new UserService()
