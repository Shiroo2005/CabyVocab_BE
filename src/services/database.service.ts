import { Sequelize, Dialect } from 'sequelize'
import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'

config()

const options = {
  dialect: 'mysql' as Dialect,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT as string)
}

class DatabaseService {
  sequelize: Sequelize
  constructor() {
    this.sequelize = new Sequelize(options)
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Unable to connect to the database:', (error as Error).message)
    }
  }
}

export const databaseService = new DatabaseService()
