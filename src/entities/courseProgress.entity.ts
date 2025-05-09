import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
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
import { User } from './user.entity'
import { Course } from './courses.entity'

@Entity()
export class CourseProgress extends BaseEntity{
    @PrimaryGeneratedColumn()
    id?: number

    @Column('double')
    progress!: number

    @ManyToOne(() => Course, course => course.courseProgresses)
    @JoinColumn({name: 'courseId'})
    course: Course

    @ManyToOne(() => User, user => user.courseProgresses)
    @JoinColumn({name: 'userId'})
    user: User
}