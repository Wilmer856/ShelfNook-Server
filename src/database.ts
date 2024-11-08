import { Sequelize } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres";
import { User } from "./models/User";
import { Book } from "./models/Book";
import UserBookCollections from "./models/UserBookCollections";
import Review from "./models/Review";


const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    ssl: false,
    clientMinMessages: 'notice',
    models: [User, Book, UserBookCollections, Review]
  })

export default sequelize;