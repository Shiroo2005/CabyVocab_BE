import { TokenPayload } from './dto/common.dto'
import { User } from './entities/user.entity'

declare module 'express' {
  interface Request {
    user?: User
    // idParams?: number
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    // sortParsed?: Record<string, 'ASC' | 'DESC'>
  }
}
