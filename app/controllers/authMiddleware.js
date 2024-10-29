const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    // Ignorer les routes de connexion et d'inscription
    if (req.path === '/auth/login' || req.path === '/auth/register') {
        return next();
    }

    // Vérifier si le token est présent
    if (!token) {
        return res.status(403).send({
            message: "Token requis pour l'authentification"
        });
    }

    try {
        // Decodage et vérification du token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next(); 
    } catch (err) {
        return res.status(401).send({
            message: "Token invalide"
        });
    }
};

module.exports = verifyToken;
