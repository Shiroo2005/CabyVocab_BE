import { IsEmail, IsNotEmpty, Length, Matches, validate } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { Role } from './role.entity'
import { RefreshToken } from './token.entity'
import { CompletedTopic } from './completedTopic.entity'
import { WordProgress } from './wordProgress.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar', { unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @Column('varchar', { unique: true })
  @Length(5, 20, { message: `Username's length must be between 5 and 20!` })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username contain only letter and number' })
  username!: string

  @Column('varchar')
  @Matches(/^(?=.*[A-Z]).{6,}$/, { message: 'Password must contain at least 6 chars, 1 uppercase!' })
  @IsNotEmpty()
  password!: string

  @Column('varchar', { default: 'N/A' })
  avatar?: string

  @Column({ default: UserStatus.NOT_VERIFIED, type: 'varchar' })
  status?: UserStatus

  @Column('int', { default: 0 })
  streak?: number

  @Column('timestamp', { default: null })
  lastStudyDate?: Date

  @Column('int', { default: 0 })
  totalStudyDay?: number

  @ManyToOne(() => Role, (role) => role.users)
  role?: Role

  @Column('double', { default: 0 })
  balance: number

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens?: RefreshToken[]

  @OneToMany(() => CompletedTopic, (completedTopic) => completedTopic.user)
  completedTopics: CompletedTopic[]

  @OneToMany(() => WordProgress, (wordProgress) => wordProgress.user)
  wordProgresses: WordProgress[]

  static createUser = ({
    id,
    email,
    username,
    password,
    avatar,
    status,
    role,
    lastStudyDate,
    streak,
    totalStudyDay
  }: User) => {
    const newUser = new User()

    newUser.id = id
    newUser.email = email
    newUser.username = username
    newUser.password = password
    newUser.avatar = avatar
    newUser.status = status
    newUser.role = role
    newUser.lastStudyDate = lastStudyDate
    newUser.totalStudyDay = totalStudyDay
    newUser.streak = streak

    return newUser
  }

  static updateUser = (
    user: User,
    {
      username,
      email,
      avatar,
      status,
      role,
      lastStudyDate,
      streak,
      totalStudyDay
    }: {
      username?: string
      email?: string
      avatar?: string
      status?: UserStatus
      roleId?: number
      role?: Role
      totalStudyDay?: number
      lastStudyDate?: Date
      streak?: number
    }
  ) => {
    if (username) user.username = username
    if (email) user.email = email
    if (avatar) user.avatar = avatar
    if (status) user.status = status
    if (role && role.id) user.role = role
    if (totalStudyDay) user.totalStudyDay = totalStudyDay
    if (lastStudyDate) user.lastStudyDate = lastStudyDate
    if (streak) user.streak = streak
    //if (tokens && tokens.length == 0) user.tokens = tokens

    return user
  }

  static deleteUser = (user: User) => {
    const res = User.softRemove(user)
    return res
  }

  static allowSortList = ['id', 'email', 'username', 'status']
}
