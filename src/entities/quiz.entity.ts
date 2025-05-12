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
import { Folder } from './folder.entity'

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  title: string

  @Column('json')
  question: JSON

  @ManyToOne(() => Folder)
  folder: Folder

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
  @DeleteDateColumn()
  deletedAt?: Date
}
