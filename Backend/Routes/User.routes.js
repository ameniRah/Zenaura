const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../Middll/authMiddleware');
const { validateUser } = require('../Middll/validation.middleware');

// Mock data structure (replace with actual model later)
let users = [];

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Create new user
router.post('/', validateUser, (req, res) => {
  const user = {
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    createdAt: new Date(),
    ...req.body
  };
  users.push(user);
  res.status(201).json(user);
});

// Update user (authenticated users can only update their own profile, admins can update any)
router.put('/:id', verifyToken, (req, res) => {
  if (req.params.id !== req.user._id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: You can only update your own profile' });
  }
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users[index] = { ...users[index], ...req.body, updatedAt: new Date() };
  res.json(users[index]);
});

// Delete user (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
