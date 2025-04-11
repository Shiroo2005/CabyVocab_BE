import { UserStatus } from "~/constants/userStatus"

export interface CreateUserBodyReq {
  email: string
  username: string
  password: string
  fullName?: string
}
  
export interface UpdateUserBodyReq {
  username: string
  email: string
  fullName: string
  avatar: string
  status: UserStatus
  roleId: number
}
