import express, { NextFunction, Request, Response } from "express";
import authenticate from "./middleware/authMiddleware";
import * as dotenv from "dotenv";
import sequelize from "./database";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";

dotenv.config();

// export interface RequestWithUser extends Request {
//   user?: {
//     uid: string;
//     email?: string;
//     [key: string]: any;
//   };
// }

const app = express();
const port = 3000;

// middleware
app.use(express.json());

//routes
app.use("/user", userRoutes);

app.use("/book", bookRoutes)

// Error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ error: "Route not found" });
});

// Sync database
sequelize
  .sync() // `force: true` drops tables each time; use cautiously
  .then(() => {
    console.log("Database synced!");
    //listen for requests
    app.listen(port, () => {
      console.log("Server successfully connected!!!");
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
