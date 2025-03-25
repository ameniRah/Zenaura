const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    console.log("🛠 En-tête Authorization : ", authorizationHeader);

    // Si l'en-tête Authorization n'existe pas
    if (!authorizationHeader) {
        console.log("❌ Aucun en-tête Authorization trouvé !");
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    // Extraction du token après "Bearer "
    const token = authorizationHeader.replace('Bearer ', '');
    console.log("🚀 Token après extraction : ", token);

    if (!token) {
        console.log("❌ Aucun token trouvé après extraction !");
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token décodé avec succès : ", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("❌ Erreur de décodage du token :", err.message);
        return res.status(401).json({ message: 'Token invalide.' });
    }
};




module.exports = authMiddleware;
