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
export class FlashCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  frontContent: string

  @Column('varchar', { default: 'N/A' })
  frontImage?: string

  @Column('nvarchar')
  backContent: string

  @Column('varchar', { default: 'N/A' })
  backImage?: string

  @ManyToOne(() => Folder)
  folder: Folder

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
