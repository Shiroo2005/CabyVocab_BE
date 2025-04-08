import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  refreshToken!: string

  @ManyToOne(() => User, (user) => user.tokens)
  user!: User

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createToken = ({ refreshToken, user }: { refreshToken: string; user: User }) => {
    const newToken = new Token()
    newToken.refreshToken = refreshToken
    newToken.user = user
    return newToken
  }
}
