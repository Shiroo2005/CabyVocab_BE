import { FindOptionsOrder } from "typeorm"
import { UserStatus } from "~/constants/userStatus"
import { Role } from "~/entities/role.entity"
import { User } from "~/entities/user.entity"

export interface userQueryReq {
  page?: number
  limit?: number
  email?: string
  username?: string
  roleName?: string
  status?: UserStatus
  sort?: FindOptionsOrder<User>
}