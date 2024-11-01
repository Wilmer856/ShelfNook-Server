import * as admin from 'firebase-admin';
import * as dotenv from'dotenv';
import * as path from 'path';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '';
const serviceAccount = require(path.resolve(serviceAccountPath))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;