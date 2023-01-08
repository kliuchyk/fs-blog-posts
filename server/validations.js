import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Min length should be 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Min length should be 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Min length should be 3 symbols').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid url').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Provide a title').isLength({ min: 3 }).isString(),
  body('text', 'Add post text').isLength({ min: 10 }).isString(),
  body('tags', 'Incorrect tags for (provide an array)').optional().isString(),
  body('imageUrl', 'Invalid url').optional().isString(),
];
