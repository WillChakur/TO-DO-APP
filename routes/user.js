const db = require('../db/index.js');
const express = require('express');
const router = express.Router();

const createUsersTable = async () => {
    let sql = `CREATE TABLE IF NOT EXISTS users (
    userID INT GENERATED ALWAYS AS IDENTITY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(62) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(userID)
    )`;

    try {
        await db(sql); 
        console.log("Users table sucessfully created.");
    }catch(err) {
        console.error("Error creating users table:", err);
    };
};
createUsersTable();

const addNewUser = async (values) => {
    let sql =  `INSERT INTO users(firstname, lastname, email, username, password)
                VALUES ($1, $2, $3, $4, $5)`;
    
    try {
        await db(sql, values);
        console.log('New user registered');
    }catch(err) {
        console.error('Error registering a new user', err);
    }
}

router.post('/', (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    let values = [ firstname, lastname, email, username, password ];

    addNewUser(values);

    res.json({ message: 'Data received', data: req.body });
});

module.exports = router;
