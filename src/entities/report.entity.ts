import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { ReportStatus, ReportType } from '~/constants/report'

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  content: string

  @ManyToOne(() => User)
  createdBy: User

  @Column('varchar')
  type: ReportType

  @Column('nvarchar')
  status: ReportStatus

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static allowSortList = ['id']
}
