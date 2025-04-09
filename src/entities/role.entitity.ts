import { Matches } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('nvarchar')
  @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]{3,}$/, {
    message: 'Name must contain at least 3 chars, 1 letter and only letter, number'
  })
  name!: string

  @Column({ default: 'N/A', type: 'nvarchar' })
  description?: string

  @OneToMany(() => User, (user) => user.role)
  users?: User[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createRole = ({ name, description, users, id }: Role) => {
    const newRole = new Role()

    newRole.id = id
    newRole.name = name
    newRole.description = description
    newRole.users = users

    return newRole
  }
}
