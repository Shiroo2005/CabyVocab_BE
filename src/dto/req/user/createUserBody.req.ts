export interface CreateUserBodyReq {
    email: string
    username: string
    password: string
    full_name?: string
}
  
export interface UpdateUserBodyReq {
    email: string
    username: string
    full_name?: string
    avatar: string
    status: number
}
  