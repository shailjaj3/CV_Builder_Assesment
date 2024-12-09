// utils/validation.js

const { body } = require('express-validator');

exports.registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .trim(),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(), 

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Optional contactNumber validation (adjust as needed)
    body('contactNumber')
        .optional()
        .isMobilePhone().withMessage('Invalid contact number format'), 
];





exports.loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(), 

    body('password')
        .notEmpty().withMessage('Password is required'),
];