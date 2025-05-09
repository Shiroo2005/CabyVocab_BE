import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
export class CompletedTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Topic, (topic) => topic.completedTopics)
  @JoinColumn({ name: 'topicId' })
  topic: Topic

  @CreateDateColumn()
  createdAt?: Date
}
