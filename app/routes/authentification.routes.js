const verifyToken = require('../controllers/authMiddleware')

module.exports = (app) => {
    const auth = require("../controllers/authentification.controller")
    const router = require('express').Router()
    // router.post('/login', auth.createUser);

    // router.post('/register', (req, res) => {
        
    //     res.send('Registration route');
    // });

    // Users register
    router.post('/register', auth.registerUser);

    // Users login
    router.post('/login', auth.loginUser);

    // Chemin préfixe de nos routes
    app.use('/auth', router)
};
