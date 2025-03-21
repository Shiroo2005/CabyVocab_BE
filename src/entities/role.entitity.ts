import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { Regex } from '~/constants/regex'

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id?: number
  declare name: string
  declare description?: string
  declare isDeleted?: boolean
  static initModel(sequelize: Sequelize) {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: Regex.ONLY_LETTER_AND_NUMBER_AND_MUST_BE_1_LETTER,
              msg: 'Name phải có ít nhất 6 ký tự và chứa ít nhất 1 chữ cái!'
            },
            notNull: {
              msg: 'Name not be null!'
            }
          }
        },
        description: {
          type: DataTypes.STRING,
          defaultValue: 'N/A'
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'Roles'
      }
    )
  }
}
