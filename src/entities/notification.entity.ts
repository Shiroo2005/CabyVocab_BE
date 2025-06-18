import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { NotificationTarget, NotificationType } from '~/constants/notification'

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  type: NotificationType

  @Column('json')
  data: any

  @Column('varchar')
  target: NotificationTarget

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
