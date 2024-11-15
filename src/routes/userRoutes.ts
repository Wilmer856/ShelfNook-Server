import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  searchUsers
} from "../controllers/userController";
import authenticate from "../middleware/authMiddleware";

const userRoutes = Router();

//search route
userRoutes.get("/search", searchUsers);

userRoutes.get("/", getUsers);

userRoutes.get("/:id", authenticate, getUser);

userRoutes.post("/register", createUser);

userRoutes.put("/:id", authenticate, updateUser);

userRoutes.delete("/:id", authenticate, deleteUser);

export default userRoutes;
