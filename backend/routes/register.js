const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const path = require('path');
const logger = require('../logger.js');
require('dotenv').config();

router.use(express.static(path.join('frontend/register/public')));
router.get('/', (req, res) => {
    res.sendFile(path.join(process.env.STATIC_FILES_BASE_DIR_REGISTER));
})

const createTasksTable = async () => {
    let sql = `CREATE TABLE IF NOT EXISTS tasks (
    taskID SERIAL PRIMARY KEY,
    taskname VARCHAR(50) NOT NULL,
    userID INTEGER REFERENCES users(userID),
    done BOOLEAN DEFAULT FALSE
    )`;

    try {
        await db(sql); 
        logger.info("Tasks table successfully created.");
    }catch(err) {
        logger.error("Error creating tasks table:", err);
    }
}

const createUserTable = async () => {
    let sql =  ` CREATE TABLE IF NOT EXISTS users (
                 userID SERIAL PRIMARY KEY,
                 firstname VARCHAR(50),
                 lastname VARCHAR(50),
                 email VARCHAR(255),
                 username VARCHAR(70),
                 password VARCHAR(255)) `

    try {
        await db(sql); 
        logger.info("Users table sucessfully created.");
    }catch(err) {
        logger.error("Error creating Users table:", err);
    };
}

(async () => {
    await createUserTable();
    await createTasksTable();
})();

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
