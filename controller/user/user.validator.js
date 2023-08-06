const { body } = require('express-validator');

// Validation schema for the register API
const signUpSchema = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation schema for the login API
const signInSchema = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation schema for the forgetPassword API
const forgetPasswordSchema = [
  body('email').isEmail().withMessage('Invalid email address'),
];

// Validation schema for the resetPassword API
const resetPasswordSchema = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = {
  signUpSchema,
  signInSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
