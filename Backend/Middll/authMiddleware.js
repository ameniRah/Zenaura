const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Token reçu:", token);

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token décodé:", decoded);

        // Ajouter les informations de l'utilisateur à la requête
        req.user = decoded;
        
        // Passer à la suite de l'exécution de la route
        next();
    } catch (err) {
        console.log("Erreur de décodage du token:", err);
        return res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = authMiddleware;
