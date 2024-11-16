import { Router } from "express";
import { addFavoriteBook, getPopularBooks, getUserLibrary, removeBookFromLibrary, saveBook, updateUserBook } from "../controllers/bookController";
import authenticate from "../middleware/authMiddleware";

const bookRoutes = Router();

bookRoutes.get("/mylibrary", authenticate, getUserLibrary);
bookRoutes.get("/popular", getPopularBooks);

// Save book to user library
bookRoutes.post("/save", authenticate, saveBook);

bookRoutes.post("/favorite/:id", authenticate, addFavoriteBook);
bookRoutes.put("/mylibrary/:id", authenticate, updateUserBook);
bookRoutes.delete("/mylibrary/:id", authenticate, removeBookFromLibrary);

export default bookRoutes;
