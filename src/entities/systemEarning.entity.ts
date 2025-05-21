import { Order } from './order.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class SystemEarning extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('double')
  amount: number

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static allowSortList = ['id', 'amount']
}
