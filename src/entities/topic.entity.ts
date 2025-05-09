import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TopicType } from '~/constants/topic'
import { CompletedTopic } from './completedTopic.entity'
import { CourseTopic } from './courseTopic.entity'
import { WordTopic } from './wordTopic.entity'
import { User } from './user.entity'
import { Vote } from './vote.entity'

@Entity()
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  @IsNotEmpty({ message: 'Title must be a not empty string!' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 chars long!' })
  title!: string

  @Column('varchar')
  @IsNotEmpty({ message: 'Description must be a not empty string!' })
  @Length(1, 255, { message: 'Description must be between 1 and 255 chars long!' })
  description!: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  thumbnail?: string

  @Column('varchar', { default: TopicType.FREE })
  @IsEnum(TopicType, { message: 'topic must be in enum TopicType' })
  @IsOptional()
  type?: TopicType

  @Column('bool')
  isPublic: boolean

  @OneToMany(() => Vote, (vote) => vote.topic)
  votes: Vote[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User

  @OneToMany(() => CompletedTopic, (completed_topic) => completed_topic.topic)
  completedTopics: CompletedTopic[]

  @OneToMany(() => CourseTopic, (courseTopic) => courseTopic.topic)
  courseTopics: CourseTopic[]

  @OneToMany(() => WordTopic, (wordTopic) => wordTopic.topic)
  wordTopics?: WordTopic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createTopic = ({ id, title, description, thumbnail, type, wordTopics }: Topic) => {
    const newTopic = new Topic()
    newTopic.id = id
    newTopic.title = title
    newTopic.thumbnail = thumbnail
    newTopic.description = description
    newTopic.type = type
    newTopic.wordTopics = wordTopics
    return newTopic
  }

  static updateTopic = (
    topic: Topic,
    {
      title,
      description,
      thumbnail,
      type,
      wordTopics
    }: {
      title?: string
      description?: string
      thumbnail?: string
      type?: TopicType
      wordTopics?: WordTopic[]
    }
  ) => {
    if (title) topic.title = title
    if (description) topic.description = description
    if (thumbnail) topic.thumbnail = thumbnail
    if (type) topic.type = type
    if (wordTopics) topic.wordTopics = wordTopics

    return topic
  }

  static allowSortList = ['id', 'title', 'description', 'type']
}
