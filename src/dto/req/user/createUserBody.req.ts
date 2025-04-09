export interface CreateUserBodyReq {
  email: string
  username: string
  password: string
  fullName?: string
}
//update email can xac thuc email
  
export interface UpdateUserBodyReq {
    full_name?: string
    avatar: string
    status: number
}
