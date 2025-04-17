const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validationMiddleware = require('./middleware/validation.middleware');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth.routes');
const personalityTraitRoutes = require('./routes/personality-trait.routes');
const testRoutes = require('./routes/test.routes');

app.use('/api/auth', authRoutes);
app.use('/api/personality-traits', personalityTraitRoutes);
app.use('/api/tests', testRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ZenAura API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.use(validationMiddleware.handleMongooseError);
app.use(validationMiddleware.errorHandler);

module.exports = app; 