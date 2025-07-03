import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { OrderStatus } from '~/constants/order'
import { Folder } from './folder.entity'

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('double')
  amount: number

  @Column('varchar', { default: OrderStatus.PENDING })
  status: OrderStatus

  @ManyToOne(() => User)
  createdBy: User

  @ManyToOne(() => Folder)
  folder: Folder

  @Column('varchar', { default: 'N/A' })
  bankTranNo: string

  @Column('varchar', { default: 'N/A' })
  nameBank: string

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  payDate: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static allowSortList = ['id', 'amount', 'status']
}
