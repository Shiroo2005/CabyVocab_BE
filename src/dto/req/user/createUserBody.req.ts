export interface CreateUserBodyReq {
  email: string
  username: string
  password: string
  fullName?: string
}

export interface UpdateUserBodyReq {
  email: string
  username: string
  fullName?: string
  avatar: string
  status: number
}
