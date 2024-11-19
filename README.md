# Hackalong 2024 Mern Practice

## First, let's set up the backend environment:

1. Create a new directory for your project and navigate to it:
```bash
mkdir mental-health-quotes-app
cd mental-health-quotes-app
```
2. Initialize a new Node.js project and install necessary dependencies:
```bash
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install --save-dev typescript @types/express @types/node nodemon ts-node
```
3. Create a tsconfig.json file for TypeScript configuration:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```
4. Create a src directory and add the following files:
```bash
mkdir src
touch src/server.ts src/app.ts src/config/database.ts
mkdir src/models src/routes src/controllers
```
5. Set up the server.ts file:
```typescript
import app from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

Set up the app.ts file:
typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Add routes here

export default app;
```
6. Set up the config/database.ts file:
```typescript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```
7. Create a .env file in the root directory:
```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Database Setup
1. Create a user model in src/models/User.ts:
```typescript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  journalEntries: [{ 
    quote: String, 
    comment: String, 
    createdAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('User', userSchema);
```
## Backend Routes and Controllers
1. Create an auth controller in src/controllers/authController.ts:
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
};
```
2. Create auth routes in src/routes/authRoutes.ts:
```typescript
import express from 'express';
import { signup, signin } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
```
3. Add the auth routes to app.ts:
```typescript
import authRoutes from './routes/authRoutes';

// ... existing code

app.use('/api/auth', authRoutes);
```

## git history to update notes with troubleshooting errors on vscode while building backend
### created repo in github
### cloned repo
`git clone <repo from github>`
`cd <repo name>`
### created directories for backend and frontend apps
`mkdir mern-backend`
`mkdir mern-frontend`
### backend environment
`npm init -y`
`npm install express mongoose dotenv bcryptjs jsonwebtoken cors`
`nvm install node`
`npm install --save-dev typescript @types/express @types/node nodemon ts-node`
### backend structure
`mkdir src`
`touch src/server.ts src/app.ts src/config/database.ts`
***Note: Had to manually create the database.ts***
`mkdir src/models src/routes src/controllers`
### Import on applicable components were not recognizing gems therefore had to install again
`npm install cors`
`npm install --save-dev @types/cors`
`npm install bcryptjs jsonwebtoken`
`npm install --save-dev @types/bcryptjs @types/jsonwebtoken`
`npm install --save-dev @types/express`
### Route file was not acknowledging the imports of the Controller file
- Therefore had to manually include module type on the package.json header  
```json
      "name": "mern-backend",
      "version": "1.0.0",
      "type": "module",
```
- Then update the tsconf.json
```json
      {
        "compilerOptions": {
          "target": "es2020",
          "module": "es2020",
          "moduleResolution": "node",
          "outDir": "./dist",
          "rootDir": "./src",
          "strict": true,
          "esModuleInterop": true,
          "allowSyntheticDefaultImports": true
        }
      }
```
- Then create two seperate controller files for signin and signup  
- Then update route file to use require   
```ts
      const express = require('express')
      const { signup } = require('../controllers/signupController')
      const { signin } = require('../controllers/signinController')

      const router = express.Router()

      router.post('/signup', signup)
      router.post('/signin', signin)

      module.exports = router

      export default router
```