import { assert } from "console";
import { string } from "node_modules/sql-formatter/dist/cjs/lexer/regexFactory";
import { CreateUserBodyReq } from "~/dto/req/user/createUserBody.req";
import { User } from "~/entities/user.entity";

class UserService{
    createUser = async ({email, username, password, full_name} : CreateUserBodyReq) => {
        if(full_name == null) full_name = email;
        const createUser = await User.create({email, username, password, full_name}, {returning: true});
        return createUser;
    }

    getUserByEmail = async ({email}: {email: string} ) => {
        const resUser = await User.findOne({
            where: {
                email
            },
            attributes: ['id', 'email', 'username', 'full_name', 'avatar', 'status']
        });
        if(!resUser) return {};
        return resUser;
    }

    getAllUser = async() => {
        return await User.findAll({attributes: ['id', 'email', 'username', 'full_name', 'status']});
    }

    getUserByFullName = async() => {

    }

    updateUser = async(userID: string, newData: Partial<User>) => {
        const user = await User.findByPk(userID);
        if (!user) {
          throw new Error('Không tìm thấy User');
        }
        await user.update(newData);
        return user;
    }

    deleteUserByEmail = async() => {

    }

    changeStatusForUser = async() => {

    }
}

export const userService = new UserService;