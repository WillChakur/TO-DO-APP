const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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


router.post('/register', async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        let values = [firstname, lastname, email, username, hashedPassword];
        
        await addNewUser(values);

        res.json({ message: 'Data received', data: req.body });
    
    }catch(err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    } 
});

router.post('/login', (req, res) => {
    const { username, password } = req.body

    let sql =   `SELECT * FROM users
                 WHERE username = ($1)`;

    


})

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

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.error('Error while hashing password:', err);
        throw err; 
    }
};

module.exports = router;
