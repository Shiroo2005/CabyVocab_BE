import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { Notification } from './notification.entity'

@Entity()
export class UserNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('boolean')
  alreadyRead: boolean

  @Column({ type: 'datetime', default: null })
  readAt?: Date

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Notification)
  notification: Notification

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
