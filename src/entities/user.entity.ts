import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { Regex } from '~/constants/regex'
import { UserStatus } from '~/constants/userStatus'

export class User extends Model<
  InferAttributes<User>, //
  InferCreationAttributes<User>
> {
  declare id?: number
  declare email: string
  declare username: string
  declare password: string
  declare full_name: string
  declare avatar?: string
  declare status?: UserStatus

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
          allowNull: false,
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
          allowNull: false,
          validate: {
            len: [5, 20]
          }
        },
        password: {
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
              args: Regex.NAME,
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
        tableName: 'Users',
        indexes: [
          { fields: ['email'], unique: true },
          { fields: ['username'], unique: true }
        ]
      }
    )
  }
}
