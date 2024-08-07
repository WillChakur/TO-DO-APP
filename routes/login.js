const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');

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

router.use(express.static(path.join(__dirname, '..', 'login', 'public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login','public', 'index.html'));
})

router.post('/', async (req, res) => {
    const { username, password } = req.body

    let sql =   `SELECT * FROM users
                 WHERE username = ($1)`;

    try {
        const data = await db(sql, [username]);

        if (data.rows.length > 0) {
            bcrypt.compare(password, data.rows[0].password, function(err, result) {
                if(err) {
                    console.error(err);
                    res.status(500).json({error: 'Internal server error'});
                }

                if(result) {
                    console.log('Password is correct');
                    const userID = data.rows[0].userid;
                    req.session.userID = userID;   
                    return res.send({ redirect: 'http://localhost:3000/tasks'});
                }else {
                    return res.status(401).json({ error: 'Incorrect Password' });
                }
            });
        }
        else {
            return res.status(404).json({ error: 'User does not exist' });
        }
    }catch(error) {
        console.error('Database query error: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }             
})


module.exports = router;
