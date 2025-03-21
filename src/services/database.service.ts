import { Sequelize, Dialect } from 'sequelize'
import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'
import { LogCustomize } from '~/utils/log'
import { User } from '~/entities/user.entities'

config()

const options = {
  dialect: 'mysql' as Dialect,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT as string),
  logging: LogCustomize.logDB
}

class DatabaseService {
  sequelize: Sequelize
  constructor() {
    this.sequelize = new Sequelize(options)
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      LogCustomize.logSuccess('Database connected successfully ✅')
    } catch (error) {
      LogCustomize.logError(`Unable to connect to the database: ${(error as Error).message}`)
    }
  }

  async syncDB() {
    // init user
    User.initModel(this.sequelize)

    // update column
    await this.sequelize.sync({ alter: true })
    LogCustomize.logSuccess('Database synchronized (alter mode) 🔄')
  }

  async init() {
    await this.connect()
    await this.syncDB()
  }
}

export const databaseService = new DatabaseService()
