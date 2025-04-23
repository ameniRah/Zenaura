/*const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const BaseController = require('./base.controller');

class AuthController extends BaseController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate request
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Email and password are required'
                    }
                });
            }

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid credentials'
                    }
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid credentials'
                    }
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email,
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Send response
            res.status(200).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Internal server error'
                }
            });
        }
    }
}

module.exports = new AuthController(); */