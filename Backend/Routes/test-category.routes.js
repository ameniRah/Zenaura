const express = require('express');
const router = express.Router();
const testCategoryController = require('../controllers/testCategoryController');

// CRUD Routes
router.post('/categories', testCategoryController.createCategory);
router.get('/categories', testCategoryController.getAllCategories);
router.get('/categories/:id', testCategoryController.getCategoryById);
router.put('/categories/:id', testCategoryController.updateCategory);
router.delete('/categories/:id', testCategoryController.deleteCategory);

module.exports = router;