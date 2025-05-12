import { User } from './user.entity'
import { Topic } from './topic.entity'
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Folder } from './folder.entity'

@Entity()
@Index(['createdBy', 'folder'], { unique: true })
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User

  @ManyToOne(() => Folder)
  folder: Folder

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
