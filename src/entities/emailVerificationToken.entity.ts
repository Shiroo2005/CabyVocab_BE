import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user.entity'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class EmailVerificationToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: 'varchar', length: 512 })
  @IsNotEmpty()
  code: string

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date
}
