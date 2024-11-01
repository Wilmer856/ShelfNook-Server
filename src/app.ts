import express, { NextFunction, Request, Response } from "express"
import authenticate from "./middleware/authMiddleware"

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

app.listen(port, () => {
    console.log("Testing API route")
})