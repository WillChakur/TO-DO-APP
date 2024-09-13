const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const logger = require('../logger.js');
require('dotenv').config();

router.use(express.static(path.join('frontend/login/public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(process.env.STATIC_FILES_BASE_DIR_LOGIN));
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
                    logger.error(err);
                    res.status(500).json({error: 'Internal server error'});
                }

                if(result) {
                    logger.info('Password is correct');
                    const userID = data.rows[0].userid;
                    req.session.userID = userID;   
                    return res.send({ redirect: '/tasks'});
                }else {
                    return res.status(401).json({ error: 'Incorrect Password' });
                }
            });
        }
        else {
            return res.status(404).json({ error: 'User does not exist' });
        }
    }catch(error) {
        logger.error('Database query error: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }             
})

module.exports = router;
