import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './auth.js';

import checkAuth from './utils/checkAuth.js';
import { getDetails, registerUser, login } from './controllers/UserController.js';

const uri =
  'mongodb+srv://user123:qwerty123@cluster0.gvoqzjc.mongodb.net/blog?retryWrites=true&w=majority';

mongoose
  .set('strictQuery', false)
  .connect(uri)
  .then(() => console.log('DB is Ok'))
  .catch((err) => console.log('DB connection error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', login);
app.post('/auth/register', registerValidation, registerUser);
app.get('/auth/me', checkAuth, getDetails);

app.listen(4444, () => {
  console.log('server is running on port 4444');
});
