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

    updateUser = async() => {
        
    }
}

export const userService = new UserService;