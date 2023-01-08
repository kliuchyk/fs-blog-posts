import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

dotenv.config();
const { DB_PASSWORD, DB_USER } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gvoqzjc.mongodb.net/blog?retryWrites=true&w=majority`;

mongoose
  .set('strictQuery', false)
  .connect(uri)
  .then(() => console.log('DB is Ok'))
  .catch((err) => console.log('DB connection error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.registerUser);
app.get('/auth/me', checkAuth, UserController.getDetails);

app.get('/posts', checkAuth, PostController.getAll);
app.get('/posts/:id', checkAuth, PostController.getOne);
app.post('/posts', [checkAuth, postCreateValidation], PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, () => {
  console.log('server is running on port 4444');
});
