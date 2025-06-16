import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
export class CompletedTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Topic, (topic) => topic.completed_topics)
  @JoinColumn({ name: 'topicId' })
  topic: Topic

  @CreateDateColumn()
  createdAt?: Date
}
