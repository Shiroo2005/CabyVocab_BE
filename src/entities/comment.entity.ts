import { User } from './user.entity'
import { Topic } from './topic.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: 'varchar', length: 256 })
  content: string

  @ManyToOne(() => Comment)
  parentComment: Comment | null

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User

  @ManyToOne(() => Topic)
  topic: Topic

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
