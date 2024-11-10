import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import authenticate from "../middleware/authMiddleware";

const userRoutes = Router();

userRoutes.get("/", getUsers);

userRoutes.get("/:id", authenticate, getUser);

userRoutes.post("/register", createUser);

userRoutes.put("/:id", authenticate, updateUser);

userRoutes.delete("/:id", authenticate, deleteUser);

export default userRoutes;
