import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

dotenv.config();
const { DB_PASSWORD, DB_USER } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gvoqzjc.mongodb.net/blog?retryWrites=true&w=majority`;

mongoose
  .set('strictQuery', false)
  .connect(uri)
  .then(() => console.log('DB is Ok'))
  .catch((err) => console.log('DB connection error', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/auth/login', [loginValidation, handleValidationErrors], UserController.login);
app.post(
  '/auth/register',
  [registerValidation, handleValidationErrors],
  UserController.registerUser,
);
app.get('/auth/me', checkAuth, UserController.getDetails);

app.get('/tags', /* checkAuth, */ PostController.getTags);

app.get('/posts', /* checkAuth, */ PostController.getAll);
app.get('/posts/:id', /* checkAuth, */ PostController.getOne);
app.post(
  '/posts',
  [checkAuth, postCreateValidation, handleValidationErrors],
  PostController.create,
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  [checkAuth, postCreateValidation, handleValidationErrors],
  PostController.update,
);

app.post('/upload', [checkAuth, upload.single('image')], (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}/`,
  });
});

app.listen(4444, () => {
  console.log('server is running on port 4444');
});
