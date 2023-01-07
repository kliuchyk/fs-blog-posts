import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Min length should be 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Min length should be 3 symbols').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid url').optional().isURL(),
];
