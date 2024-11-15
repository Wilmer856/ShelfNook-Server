import { Request, Response } from "express";
import { User } from "../models/User";
import { RequestWithUser } from "../types/express";
import redisClient from "../config/redis";
import elasticClient from "../config/elasticsearch";

export const getUsers = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const getUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {

    const { uid } = req.user || {};

    // Check Redis cache
    const cachedProfile = await redisClient.get(`user:${uid}`);
    if (cachedProfile) {
      res.json(JSON.parse(cachedProfile));
      return;
    }

    const user = await User.findOne({where: {firebase_uid: uid}});
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await redisClient.set(`user:${uid}`, JSON.stringify(user), { EX: 3600 }); // cache for 1 hour

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

//User creation handled in client with Firebase SDK
export const createUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { uid, email, username } = req.body;

    // Check if the user already exists in your database
    let user = await User.findOne({ where: { firebase_uid: uid } });
    if (user) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Save user data to your database
    user = await User.create({
      firebase_uid: uid,
      email,
      username,
    });

    // Index the new user in Elasticsearch
    await elasticClient.index({
      index: "users",
      id: user.firebase_uid,
      body: {
        username: user.username,
        email: user.email,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const firebaseUserId = req.user?.uid;
    const user = await User.findOne({where: {firebase_uid: firebaseUserId}});

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating the user" });
  }
};

export const deleteUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const firebaseUserId = req.user?.uid;
    const user = await User.findOne({where: {firebase_uid: firebaseUserId}});
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await user.destroy()
    res.status(204).json(); //Send no content
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.query as string;

  if (!query) {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }

  try {
    await elasticClient.indices.refresh({ index: "users" });

    const result = await elasticClient.search({
      index: "users",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["username", "email"],
            type: "phrase_prefix",
          }
      },
      size:100
    }
  });

    const users = (result.body.hits.hits as any[]).map((hit) => hit._source);
    res.json(users);
  } catch (error) {
    console.error("Elasticsearch search error:", error);
    res.status(500).json({ error: "Error searching users" });
  }
}
