const db = require('../models')
const User = db.users

const Op = db.Sequelize.Op

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { where } = require('sequelize')

// Get all users
exports.findAll = (req, res) => {
    const nom = req.query.nom
    var condition = nom ? { title: { [Op.iLike]: `%${nom}` } } : null
    User.findAll({ where: condition })
        .then(data => {
            if (data == null) {
                res.json({
                    message: "Y a pas de données dans le BD"
                })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users"
            })
        })
}

// Create User
exports.createUser = async (req, res) => {
    // Vérification des champs obligatoires
    const { nom, email, motdepasse, confirmation } = req.body;

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

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Création de l'utilisateur
    const user = {
        nom: nom,
        email: email,
        motdepasse: hashedPassword,
        salt: salt,
        createdAt: new Date(),
        state: 0
    };

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

// Update a User by the id in the request
exports.updateUser = async (req, res) => {
    const idManager = req.params.idManager;

    // Vérification des champs obligatoires
    if (!req.body.nom && !req.body.email) {
        return res.status(400).send({
            message: "Au moins un champ doit être fourni pour la mise à jour"
        });
    }

    // const hashedPassword = await bcrypt.hash(req.bodymotdepasse, 10);

    const updatedUser = {
        nom: req.body.nom,
        email: req.body.email
    };

    try {
        // FInd User ID
        const user = await User.findByPk(idManager);

        if (!user) {
            return res.status(404).send({
                message: "Utilisateur non trouvé"
            });
        }

        await User.update(updatedUser, {
            where: { id: idManager }
        });

        res.send({ message: "Utilisateur mis à jour avec succès" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la mise à jour de l'utilisateur"
        });
    }
};

exports.deleteUser = async (req, res) => {
    const idManager = req.params.idManager
    try {
        // Find users by indetifiant
        const user = await User.findByPk(idManager)

        if (!user) {
            return res.status(404).send({
                message: "Utilisateur non trouvé"
            })
        }

        await User.destroy({
            where   : { id: idManager }
        })

        res.send({ message: "Utilisateur supprimé avec succès" })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la suppression de l'utilisateur"
        })
    }
}

exports.disableUser = async (req, res) => {
    let idManager = req.params.idManager
    // COnversion de idManager en entiers

    if(isNaN(idManager)){
        return res.status(400).send({
            message: "L'ID de l'utilisateur devrait étre un entier valide"
        })}

    idManager = parseInt(idManager)
    try {
        // Find user by identifiant
        const user = await User.findByPk(idManager)
        if (!user) {
            return res.status(404).send({
                message: "Utilisateur non trouvé"
            })
        }

        // let reque =  await User.update({ etat: 9 }, {
        //     where: { id: idManager }
        // }).then(data => {
        //     return data
        // })

        await User.update({ etat: 9 }, {
            where: { id: idManager }
        })

        // console.log(reque)

        res.send({
            // id: idManager,
            // type: typeof(idManager),
            message: "Utilisateur desactivé avec succès",
            // reque: reque
        })
        // res.send({ message: "Utilisateur desactivé avec succès" })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la suppression de l'utilisateur"
        })
    }
}