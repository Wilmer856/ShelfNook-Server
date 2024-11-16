import { Request, Response } from "express";
import { Book } from "../models/Book";
import UserBookCollection from "../models/UserBookCollections"; // Link table
import { User } from "../models/User";
import { RequestWithUser } from "../types/express";
import sequelize from "../database";
import * as dotenv from "dotenv"
import axios from "axios"

dotenv.config()

export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { google_books_id, title, author, genre, publishedYear, description } = req.body;

    const user = await User.findOne({ where: { firebase_uid: req.user?.uid } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    // Check if the book already exists in the database
    let book = await Book.findOne({ where: { google_books_id } });

    // If not, create a new entry in the books table
    if (!book) {
      book = await Book.create({
        google_books_id,
        title,
        author,
        genre,
        publishedYear,
        description,
      });
    }

    await UserBookCollection.create({
        user: Number(user.user_id),
        book: Number(book.book_id),
        status: "wishlist",
    });

    res.status(201).json({ message: "Book saved to your library.", book });
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).json({ error: "Error saving book" });
  }
};

export const getUserLibrary = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const userId = req.user?.user_id;

        const userBooks = await UserBookCollection.findAll({
            where: { user: Number(userId)},
            include: [Book]
        })
        res.json(userBooks);
    } catch (error) {
        console.error("Error fetching user library", error);
        res.status(500).json({error: "Error fetching user library"});
    }
}

export const addFavoriteBook = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const userId = req.user?.user_id;
        const bookId = req.params.id;

        const userBook = await UserBookCollection.findOne({where: {user: Number(userId), book: bookId}})

        if(!userBook) {
            res.status(404).json({error: "Book not found in user library"});
            return;
        }

        userBook.status = "favorite";
        await userBook.save();
        res.json({message: "Book marked as favorite", userBook});
    } catch (error) {
        console.error("Error marking book as favorite");
        res.status(500).json({error: "Error marking book as favorite"})
    }
}

export const removeBookFromLibrary = async (req: RequestWithUser, res: Response) : Promise<void> => {
    try {
        const userId = req.user?.user_id;
        const bookId = req.params.id;

        const userBook = await UserBookCollection.findOne({where: {user: Number(userId), book: bookId}});

        if(!userBook) {
            res.status(500).json({error: "Book not found in user library"});
            return;
        }

        await userBook.destroy();
        res.status(204).send();

    } catch (error) {
        console.error("Error removing book from library");
        res.status(500).json({error: "Error removing book from library"});
    }
}

export const getPopularBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const popularBooks = await Book.findAll({
          include: [
            {
              model: UserBookCollection,
              attributes: [],
            },
          ],
          attributes: {
            include: [
              [
                sequelize.fn("COUNT", sequelize.col("UserBookCollections.book")),
                "interactionCount",
              ],
            ],
          },
          group: ["Book.book_id"],
          order: [[sequelize.literal("interactionCount"), "DESC"]],
          limit: 10,
        });

        res.json(popularBooks);
      } catch (error) {
        console.error("Error fetching popular books:", error);
        res.status(500).json({ error: "Error fetching popular books" });
      }
}

export const updateUserBook = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
      const userId = req.user?.user_id;
      const bookId = req.params.id;
      const { status } = req.body;

      const userBook = await UserBookCollection.findOne({ where: { user: Number(userId), book: bookId } });
      if (!userBook) {
        res.status(404).json({ error: "Book not found in user library" });
        return;
      }

      userBook.status = status;
      await userBook.save();

      res.json({ message: "Book interaction updated", userBook });
    } catch (error) {
      console.error("Error updating book interaction:", error);
      res.status(500).json({ error: "Error updating book interaction" });
    }
  };

  export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;

      if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }

      const apiKey = process.env.GOOGLE_BOOKS_API_KEY; // Your Google Books API Key
      const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

      // Call Google Books API
      const response = await axios.get(googleBooksUrl);

      if (response.status !== 200) {
        res.status(response.status).json({ error: "Failed to fetch data from Google Books API" });
        return;
      }

      // Format the response for frontend
      const books = response.data.items.map((item: any) => ({
        googleBooksId: item.id,
        title: item.volumeInfo.title || "N/A",
        authors: item.volumeInfo.authors || ["Unknown Author"],
        description: item.volumeInfo.description || "No description available.",
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || "No thumbnail available.",
        publishedDate: item.volumeInfo.publishedDate || "Unknown",
      }));

      res.status(200).json(books);
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ error: "Error searching books" });
    }
  };
