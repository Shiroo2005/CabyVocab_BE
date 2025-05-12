import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { Quiz } from './quiz.entity'
import { FlashCard } from './flashCard.entity'
import { generatedUuid } from '~/utils'
import { lengthCode } from '~/constants/folder'

@Entity()
export class Folder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, type: 'varchar' })
  code: string

  @Column('nvarchar')
  name: string

  @ManyToOne(() => User)
  createdBy: User

  @OneToMany(() => Quiz, (quiz) => quiz.folder, { cascade: true })
  quizzes: Quiz[]

  @OneToMany(() => FlashCard, (flashCard) => flashCard.folder, { cascade: true })
  flashCards: FlashCard[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static allowSortList = ['name']
}
