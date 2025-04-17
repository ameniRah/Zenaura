require('dotenv').config();

const config = {
    // Server configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // MongoDB configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
    
    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'test-secret-key',
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

    mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017/test',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};

module.exports = config;