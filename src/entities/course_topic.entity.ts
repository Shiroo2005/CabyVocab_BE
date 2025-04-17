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
import { Topic } from './topic.entity'
import { Course } from './courses.entity'


@Entity()
export class CourseTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.courseTopics)
  @JoinColumn({name: 'courseId'})
  course: Course;

  @ManyToOne(() => Topic, (topic) => topic.courseTopics)
  @JoinColumn({name: 'topicId'})
  topic: Topic;

  @Column('int')
  display_order: number;
}