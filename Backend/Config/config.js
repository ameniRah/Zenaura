require('dotenv').config();

const config = {
    // Server configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // MongoDB configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/zenaura',
    TEST_MONGODB_URI: 'mongodb://localhost:27017/zenaura_test',
    
    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-zenaura',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    
    // API configuration
    API_VERSION: process.env.API_VERSION || 'v1',
    API_PREFIX: process.env.API_PREFIX || '/api',
    
    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    
    // Rate limiting
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100, // 100 requests per window
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // Security
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

    // Test configuration
    test: {
        MONGODB_URI: 'mongodb://localhost:27017/zenaura_test',
        PORT: 3001,
        JWT_SECRET: 'test_jwt_secret'
    }
};

module.exports = config;