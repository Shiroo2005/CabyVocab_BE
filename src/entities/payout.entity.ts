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
import { Folder } from './folder.entity'
import { PayoutStatus } from '~/constants/transaction'

@Entity()
export class Payout extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('double')
  amount: number

  @Column('varchar', { default: PayoutStatus.PENDING })
  status: PayoutStatus

  @ManyToOne(() => User)
  createdBy: User

  @Column('varchar')
  numberAccount: string

  @Column('varchar')
  nameBank: string

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static sortAllowList = ['amount', 'status', 'nameBank']
}
