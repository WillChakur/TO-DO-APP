const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const logger = require('../logger.js');
require('dotenv').config();

router.use(express.static(path.join('frontend/register/public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(process.env.STATIC_FILES_BASE_DIR_REGISTER));
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

        return res.status(201).json({ message: 'User registered successfully',redirect: '/login'});
    }catch(err) {
        logger.error('Error registering the user: ', err);
        res.status(500).json({ error: 'Failed to create user' });
    } 
});

const addNewUser = async (values) => {
    let sql =  `INSERT INTO users(firstname, lastname, email, username, password)
                VALUES ($1, $2, $3, $4, $5)`;
    
    try {
        await db(sql, values);
        logger.info('New user registered');
    }catch(err) {
        logger.error('Error registering a new user:', err);
        throw err;
    }
}

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        logger.error('Error while hashing password:', err);
        throw err; 
    }
};

module.exports = router;
