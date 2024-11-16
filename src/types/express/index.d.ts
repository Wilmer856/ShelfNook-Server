import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    user_id: Number,
    uid: string;
    email?: string;
    [key: string]: any;
  };
}
