const { validationResult } = require('express-validator');
const yup = require('yup');

const validationMiddleware = {
  /**
   * Validates request using express-validator
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateRequest: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }
    next();
  },

  /**
   * Validates user data using Yup schema
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateUser: async (req, res, next) => {
    try {
      const userSchema = yup.object().shape({
        nom: yup.string()
          .matches(/^[a-zA-Z]/, 'Name must start with a letter')
          .required('Name is required'),
        prenom: yup.string()
          .matches(/^[a-zA-Z]/, 'Prenom must start with a letter')
          .required('Prenom is required'),
        email: yup.string()
          .email('Invalid email format')
          .matches(/@esprit.tn$/, 'Email must belong to esprit.tn domain')
          .required('Email is required'),
        role: yup.string()
          .matches(/^[a-zA-Z]/, 'Role must start with a letter')
          .required('Role is required'),
      });

      await userSchema.validate(req.body);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * Handles Mongoose validation errors
   * @param {Error} err - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  handleMongooseError: (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(err.errors)[0].message
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate key error'
      });
    }
    next(err);
  },

  /**
   * Global error handler
   * @param {Error} error - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  errorHandler: (error, req, res, next) => {
    console.error('Error:', error);

    res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
};

module.exports = validationMiddleware;