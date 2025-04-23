const jwt = require('jsonwebtoken');
const config = require('../Config/config');

/**
 * Authentication middleware functions
 * @module authMiddleware
 */

/**
 * Verify JWT token from request headers with detailed logging
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.header('Authorization');
    console.log("🛠 En-tête Authorization : ", authorizationHeader);

    if (!authorizationHeader) {
        console.log("❌ Aucun en-tête Authorization trouvé !");
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    console.log("🚀 Token après extraction : ", token);

    if (!token) {
        console.log("❌ Aucun token trouvé après extraction !");
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        // Special handling for test environment
        if (process.env.NODE_ENV === 'test' && token.startsWith('test-')) {
            const [, role] = token.split('test-');
            req.user = {
                _id: 'test-user-id',
                role: role.replace('-token', ''),
                email: role === 'admin' ? 'admin@test.com' : 'user@test.com',
                isAdmin: role === 'admin'
            };
            console.log("✅ Test environment token processed : ", req.user);
            return next();
        }

        // Use JWT_SECRET from environment variables first, then fallback to config
        const jwtSecret = process.env.JWT_SECRET || config.JWT_SECRET || 'maSuperCleSecrete123';
        const decoded = jwt.verify(token, jwtSecret);
        console.log("✅ Token décodé avec succès : ", decoded);
        
        req.user = {
            ...decoded,
            isAdmin: decoded.role === 'admin'
        };
        next();
    } catch (error) {
        console.log("❌ Erreur de décodage du token :", error.message);
        return res.status(401).json({ message: 'Token invalide.' });
    }
};

/**
 * Check if the user has specific role(s)
 * @param {...string} roles - Roles to check against
 * @returns {Function} Middleware function
 */
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
        }
        next();
    };
};

/**
 * Check if the user has admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.isAdmin && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin privileges required' });
    }

    next();
};

module.exports = { 
    verifyToken,
    isAdmin,
    checkRole 
};