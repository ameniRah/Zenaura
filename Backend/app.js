const express = require('express');
const mongo = require('mongoose');
const db = require('./Config/db.json');
const path = require('path');
const UserRouter = require('./Routes/User');
require('dotenv').config();

mongo.connect(db.url)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(express.json()); // Conversion des données JSON pour les requêtes
app.use('/user', UserRouter)

const server = require('http').createServer(app);

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
