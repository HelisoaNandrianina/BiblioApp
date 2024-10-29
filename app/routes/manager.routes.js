

module.exports = app => {
    const managerController = require("../controllers/manager.controller")

    const router = require('express').Router()


    router.get('/managers', managerController.findAll)

    router.post('/manager', managerController.createUser)

    router.put('/manager/:idManager', managerController.updateUser)

    router.delete('/manager/:idManager', managerController.deleteUser)

    router.put('/disable/:idManager', managerController.disableUser)

    router.get('/manager', (req, res) => {
        res.send({
            message: "Welcome to route protected",
            user: req.user
        })
    })

    // Chemin préfixe de nos routes
    app.use('/', router)
}