import { User } from "~/entities/user.entity";
import bcrypt from "bcrypt"
import { BadRequestError } from "~/core/error.response";
class AuthService {
    register = async ({ email, username, password }: { email: string, username: string, password: string }) => {
        if(!email||!username||!password) {
            throw new BadRequestError({message: 'Missing required fields'})
        }
        
        //check if user exist
        const existingUser = await User.findOne({
            where: {
                email
            }
        })
        if (existingUser) {
            throw new BadRequestError({message: 'User already exist'})
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
        return {
            success: true,
            message: 'Register successful',
            data: newUser 
        }
    }

    login = async ({ email, password }: { email: string, password: string }) => {
        if(!email||!password) {
            throw new BadRequestError({message: 'Missing required fields'})
        }

       //find user by email
       const user = await User.findOne({
        where: {
            email
        }
       })
       if (!user) {
        throw new BadRequestError({message: 'User does not exist'})
       }
       //compare password
       const isMatch = await bcrypt.compare(password, user.password)
       if (!isMatch) {
        throw new BadRequestError({message: 'Password is incorrect'})
       }
       //return user without password
       const { password: _, ...userData } = user
       return {
        success: true,
        message: 'Login successful',
        data: userData
       }
    }
}

export const authService = new AuthService()