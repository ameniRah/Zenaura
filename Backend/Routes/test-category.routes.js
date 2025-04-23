const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth.js');
const validation = require('../Middll/validation.middleware');

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../Controller/test-category.controller');

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('name').notEmpty().trim().withMessage('Category name is required'),
    body('description').optional().trim(),
    body('parentId').optional().isMongoId().withMessage('Invalid parent category ID'),
    body('isActive').optional().isBoolean()
];

// Routes with correct middleware
router.get('/', auth, getAllCategories);
router.get('/:id', auth, validateId, validation.validateRequest, getCategoryById);
router.post('/', auth, validateCreateUpdate, validation.validateRequest, createCategory);
router.put('/:id', auth, validateId, validateCreateUpdate, validation.validateRequest, updateCategory);
router.delete('/:id', auth, validateId, validation.validateRequest, deleteCategory);

module.exports = router;