import { UserStatus } from "~/constants/userStatus"
import { Role } from "~/entities/role.entity"

export interface CreateUserBodyReq {
  email: string
  username: string
  password: string
  fullName?: string
  roleId: number
}
  
export interface UpdateUserBodyReq {
  username?: string
  email?: string
  fullName?: string
  avatar?: string
  status?: UserStatus
  roleId?: number
}
