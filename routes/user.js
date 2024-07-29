import * as db from '../db/index.js';
const express = require('express');
const router = express.Router();

const createUsersTable = async () => {
    let sql = `CREATE TABLE IF NOT EXISTS users (
    userID INT GENERATED ALWAYS AS IDENTITY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(62) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    PRIMARY KEY(userID)
    )`;

    try {
        await db.query(sql); 
        console.log("Users table sucessfully created.");
    }catch(err) {
        console.error("Erro creating the table:", err);
    };
};


module.exports = router;
