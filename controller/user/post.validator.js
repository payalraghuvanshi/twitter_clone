const { body } = require('express-validator');

// Validation schema for the user post API
const userPostSchema = [
    body('description').notEmpty().isLength({ max: 280 }).withMessage('Description must not exceed 280 characters'),
];

// Validation schema for the edit post API
const editPost = [
    body('description').notEmpty().isLength({ max: 280 }).withMessage('Description must not exceed 280 characters'),
];



module.exports = {
    userPostSchema,
    editPost
};
