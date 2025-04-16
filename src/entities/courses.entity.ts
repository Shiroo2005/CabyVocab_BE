import { IsEnum, isEnum, IsNotEmpty, isNotEmpty, IsOptional, Length, Matches } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import internal from 'stream'
import { Topic } from './topic.entity'
import { WordRank } from '~/constants/word'
import { CourseProgress } from './course_progress.entity'
import { CourseTopic } from './course_topic.entity'

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  @IsNotEmpty({ message: 'Title must be a not empty string!' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 chars long!' })
  title!: string

  @Column('varchar')
  @IsNotEmpty({message: 'courses level must be not empty'})
  @IsEnum(WordRank, { message: 'Topic level must be in enum rank' })
  @IsOptional()
  level!: WordRank

  @Column('varchar')
  @Length(1, 255, { message: 'Target must be between 1 and 255 chars long!' })
  target?: string

  @Column('varchar')
  @Length(1, 255, { message: 'Description must be between 1 and 255 chars long!' })
  description?: string

  @ManyToOne(() => Topic, (topic) => topic.courses)
  topic: Topic

  @OneToMany(() => CourseProgress, (courseProgress) => courseProgress.course)
  courseProgresses: CourseProgress[]

  @OneToMany(() => CourseTopic, (courseTopic) => courseTopic.course)
  courseTopics: CourseTopic[]
  
  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}