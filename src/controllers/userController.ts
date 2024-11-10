import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const firebaseUserId = req.user?.firebaseUserId;
    const user = await User.findOne({where: {firebase_uid: firebaseUserId}});
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

//User creation handled in client with Firebase SDK
export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid, email, username} = req.body
    // Save user in database
    const newUser = await User.create({
        firebase_uid: uid,
        email,
        username,
    })
    res.status(201).json({message: "User registered successfully", user:newUser})
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const firebaseUserId = req.user?.firebaseUserId;
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const firebaseUserId = req.user?.firebaseUserId;
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
