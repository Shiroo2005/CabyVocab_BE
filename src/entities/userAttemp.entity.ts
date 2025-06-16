import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TargetType } from '~/constants/target'
import { User } from './user.entity'
import { Quiz } from './quiz.entity'

@Entity()
export class UserAttempt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  count: number

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Quiz)
  quiz: Quiz

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
