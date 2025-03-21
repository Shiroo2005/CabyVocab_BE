import { DataTypes, Model, Sequelize } from 'sequelize'
import { Regex } from '~/constants/regex'
import { UserStatus } from '~/constants/userStatus'

export class User extends Model {
  id?: number
  email!: string
  username!: string
  passwordd!: string
  full_name!: string
  avatar?: string
  status?: UserStatus

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            isEmailCheck(value: string) {
              if (!Regex.EMAIL.test(value)) {
                throw new Error('Email không hợp lệ')
              }
            }
          }
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            len: [5, 20]
          }
        },
        passwordd: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: Regex.PASSWORD,
              msg: 'Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ hoa!'
            }
          }
        },
        full_name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: Regex.FULL_NAME,
              msg: 'Full name phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ cái!'
            }
          }
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'N/A'
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: UserStatus.NOT_VERIFIED
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
      }
    )
  }
}
