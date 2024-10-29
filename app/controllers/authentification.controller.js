// Importation du models
const db = require('../models')

const User = db.users

// Importation du bcrypt et crypto pour hashage
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// const Op = db.Sequelize.Op

// Importation du JSON WEB TOKEN
const jwt = require('jsonwebtoken');

// Env config
require('dotenv').config();

// Inscription d'un utilisateur
module.exports.registerUser = async (req, res) => {
    // Nom, email, mot de passe et confirmation du mot de passe get by body
    const { nom, email, motdepasse, confirmation } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !email || !motdepasse || !confirmation) {
        return res.status(400).send({
            message: "Tout est obligatoire"
        });
    }

    // Vérification si les mots de passe correspondent
    if (motdepasse !== confirmation) {
        return res.status(400).send({
            message: "Les mots de passe ne correspondent pas"
        });
    }


    // Cryptage de salt and mot de passe par crypto et bcrypt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Création de l'utilisateuren objet
    const user = {
        nom: nom,
        email: email,
        motdepasse: hashedPassword,  
        salt: salt,
        createdAt: new Date(),
        state: 0
    };

    // Create utilisateur
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la création de l'utilisateur"
            });
        });
};

// Users login (avec JWT)
module.exports.loginUser = async (req, res) => {
    // Email et mod de passe via body
    const { email, motdepasse } = req.body;

    // Vérification si email et mot de passe sont fournis
    if (!email || !motdepasse) {
        return res.status(400).send({
            message: "Il faut fournir le mot de passe et/ou email!!"
        });
    }

    try{

        // Search user by email
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).send({
                message: "Utilisateur non trouvé"
            });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(motdepasse, user.motdepasse);
        if (!validPassword) {
            return res.status(401).send({
                message: "Mot de passe invalide"
            });
        }

        // Géneration du token JWT
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

        res.send({
            message: "Connexion reussie",
            token: token,
            user: {
                id:user.id,
                nom: user.nom,
                email: user.email,
                motdepasse: user.motdepasse,
                salt: user.salt,
                createdAt: user.createdAt,
                state: user.state
            }
        })
    } catch(err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la connexion de l'utilisateur"
        });
    }
}
