import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TopicType } from '~/constants/topic'
import { Word } from './word.entity'
import { CompletedTopic } from './completed_topic.entity'
import { CourseTopic } from './course_topic.entity'

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

  //foreign key
  @ManyToMany(() => Word, { cascade: true })
  @JoinTable({ name: 'word_topic' })
  words?: Word[]

  @OneToMany(() => CompletedTopic, (completed_topic) => completed_topic.topic)
  completed_topics: CompletedTopic[]

  @OneToMany(() => CourseTopic, (courseTopic) => courseTopic.course)
  courseTopics: CourseTopic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createTopic = ({ id, title, description, thumbnail, type, words }: Topic) => {
    const newTopic = new Topic()
    newTopic.id = id
    newTopic.title = title
    newTopic.thumbnail = thumbnail
    newTopic.description = description
    newTopic.type = type
    newTopic.words = words
    return newTopic
  }

  static updateTopic = (
    topic: Topic,
    {
      title,
      description,
      thumbnail,
      type
      //words
    }: {
      title?: string
      description?: string
      thumbnail?: string
      type?: TopicType
      //words?: Word[]
    }
  ) => {
    if (title) topic.title = title
    if (description) topic.description = description
    if (thumbnail) topic.thumbnail = thumbnail
    if (type) topic.type = type
    //if (words) topic.words = words

    return topic
  }

  static allowSortList = ['id', 'title', 'description', 'type']
}
