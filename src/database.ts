import { Sequelize } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres";


const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    ssl: false,
    clientMinMessages: 'notice'
  })

export default sequelize;