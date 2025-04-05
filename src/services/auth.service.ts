import { User } from "~/entities/user.entity";
import bcrypt from "bcrypt"
import { BadRequestError } from "~/core/error.response";
import { Op } from "sequelize";
class AuthService {
    register = async ({ email, username, password }: { email: string, username: string, password: string }) => {
        if (!email || !username || !password) {
            throw new BadRequestError({ message: 'Thiếu thông tin cần thiết' })
        }

        //check if user exist by email or username
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        })
        if (existingUser) {
            throw new BadRequestError({ message: 'Người dùng đã tồn tại' })
        }
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create new user
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            full_name: username,
        }, {
            returning: true
        })
        const { password: _, ...newUserData } = newUser.toJSON()
        return {
            user: newUserData
        }
    }

    login = async ({ username, password }: { username: string, password: string }) => {
        if (!username || !password) {
            throw new BadRequestError({ message: 'Thiếu thông tin cần thiết' })
        }

        //find user by email or username
        const user = await User.findOne({
            where: {
                username
            }
        })
        if (!user) {
            throw new BadRequestError({ message: 'Người dùng không tồn tại' })
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BadRequestError({ message: 'Mật khẩu sai' })
        }
        //return user without password
        const { password: _, ...userData } = user.toJSON()
        return {
            user: userData
        }
    }
}

export const authService = new AuthService()