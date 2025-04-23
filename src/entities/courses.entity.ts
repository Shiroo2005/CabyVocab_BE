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
import { Topic } from './topic.entity'
import { WordRank } from '~/constants/word'
import { CourseProgress } from './course_progress.entity'
import { CourseTopic } from './course_topic.entity'
import { CourseLevel } from '~/constants/course'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody,req'

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
  @IsEnum(CourseLevel, { message: 'Topic level must be in enum rank' })
  level!: CourseLevel

  @Column('int', {default: 0})
  totalTopic?: number

  @Column('varchar')
  @Length(1, 255, { message: 'Target must be between 1 and 255 chars long!' })
  target?: string

  @Column('varchar')
  @Length(1, 255, { message: 'Description must be between 1 and 255 chars long!' })
  description?: string

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

  static updateCourse = async (
    course: Course, 
    {
      title,
      level,
      target,
      description,
      topics
    }: UpdateCourseBodyReq
  ) => {
    if (title) course.title = title
    if (level) course.level = level
    if (target) course.target = target
    if (description) course.description = description

    if (topics && topics.length > 0)
    {
      CourseTopic.delete({course: {id: course.id}})

      const courseTopics: CourseTopic[] = []

      for (const topic of topics) {
        const existingTopic = await Topic.getRepository().findOne({
          where: { id: topic.id }
        })
        if (existingTopic) {
          courseTopics.push(
              CourseTopic.create({
              course: course,
              topic: existingTopic,
              displayOrder: topic.displayOrder,
            })
          );
        }
      }

      course.courseTopics = courseTopics;
    }

    await course.save()
    return course
  }

  static allowSortList = [
    'id',
    'title',
    'level',
    'target',
    'description'
  ]

}