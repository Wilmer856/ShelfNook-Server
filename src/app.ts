import express, { NextFunction, Request, Response } from "express"
import authenticate from "./middleware/authMiddleware"
import { Sequelize } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres";
import * as dotenv from'dotenv';
import sequelize from "./database";

dotenv.config();


export interface RequestWithUser extends Request {
    user?: {
      uid: string;
      email?: string;
      [key: string]: any;
    };
}

const app = express()
const port = 3000

app.get('/profile', authenticate, (req : RequestWithUser, res : Response) => {
    res.send(`Hello ${req.user?.email}`);
})

sequelize.sync({ force: true }) // `force: true` drops tables each time; use cautiously
  .then(() => {
    console.log("Database synced!");
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });

app.listen(port, () => {
    console.log("Server successfully connected!!!")
})
