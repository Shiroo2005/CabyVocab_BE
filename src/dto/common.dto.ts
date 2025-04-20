import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/token'

export interface TokenPayload extends JwtPayload {
  userId: number
  tokenType: TokenType
  exp: number
}
