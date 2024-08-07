const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

router.use(express.static(path.join(__dirname, '..', 'register', 'public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'register','public', 'index.html'));
})

router.post('/', async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    if (!firstname || !lastname || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const values = [firstname, lastname, email, username, hashedPassword];
        
        await addNewUser(values);

        res.status(201).json({ message: 'User registered successfully' });
    
    }catch(err) {
        console.error('Error registering the user: ', err)
        res.status(500).json({ error: 'Failed to create user' });
    } 
});

const addNewUser = async (values) => {
    let sql =  `INSERT INTO users(firstname, lastname, email, username, password)
                VALUES ($1, $2, $3, $4, $5)`;
    
    try {
        await db(sql, values);
        console.log('New user registered');
    }catch(err) {
        console.error('Error registering a new user:', err);
        throw err;
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
