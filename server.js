const express = require("express");
require('dotenv').config();

const userRoutes = require('./app/routes/manager.routes');
const authentificationRoutes = require('./app/routes/authentification.routes');

// Middleware pour les routes
const verifyToken = require('./app/controllers/authMiddleware');

const port = process.env.PORT || 3000;

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: `http://localhost:${port}`
};

app.use(cors(corsOptions));

// Middleware pour les routes protégées
app.use((req, res, next) => {
    // On ignore les routes /login et /register
    if (req.path === '/auth/login' || req.path === '/auth/register') {
        return next();
    } else {
        verifyToken(req, res, next);
    }
})

userRoutes(app);
authentificationRoutes(app);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
