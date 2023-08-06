const express = require('express');
const multer = require('multer');
const userController = require('../controller/user/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const {
  signUpSchema,
  signInSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require('../controller/user/user.validator');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import the handleValidationErrors middleware
const { handleValidationErrors } = require('../middleware/validate.schema');

// Admin routes
router.post('/register', upload.single('profilePic'), signUpSchema, handleValidationErrors, userController.signUp);
router.post('/login', signInSchema, handleValidationErrors, userController.signIn);
router.post('/logout',authMiddleware, userController.signOut);
router.post('/forgot-password', forgetPasswordSchema, handleValidationErrors, userController.forgetPassword);
router.post('/reset-password/:token', resetPasswordSchema, handleValidationErrors, userController.resetPassword);
router.get('/get-user', authMiddleware, userController.getUsers);

module.exports = router;
