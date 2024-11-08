import admin from '../firebaseConfig';
import { Request, Response, NextFunction, RequestHandler } from 'express';


interface RequestWithUser extends Request {
    user?: {
      uid: string;
      email?: string;
      [key: string]: any;
    };
  }

const authenticate: RequestHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
        return; 
    }

    const handleTokenVerification = async () => {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log(decodedToken)
            req.user = {
              uid: decodedToken.uid,
              email: decodedToken.email || '',
              ...Object.fromEntries(Object.entries(decodedToken).filter(([key]) => !['uid', 'email'].includes(key))),
            };
            next();
          } catch (error) {
            res.status(401).send("User can't be authenticated");
          }
    }
    handleTokenVerification();
};

export default authenticate;