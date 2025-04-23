const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validate = require('../Middll/validation.middleware');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../Controller/test-category.controller');

// Base path: /api/categories

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('name').notEmpty().trim().withMessage('Category name is required'),
    body('description').optional().trim(),
    body('parentId').optional().isMongoId().withMessage('Invalid parent category ID'),
    body('isActive').optional().isBoolean()
];

// GET /api/categories
router.get('/', auth, getAllCategories);

// GET /api/categories/:id
router.get('/:id', auth, validateId, validate, getCategoryById);

// POST /api/categories
router.post('/', auth, validateCreateUpdate, validate, createCategory);

// PUT /api/categories/:id
router.put('/:id', auth, validateId, validateCreateUpdate, validate, updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', auth, validateId, validate, deleteCategory);

module.exports = router;