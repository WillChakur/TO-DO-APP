import * as db from '../db/index.js';
const express = require('express');
const router = express.Router();

const createTasksTable = async () => {
    let sql = `CREATE TABLE IF NOT EXISTS tasks (
    taskID SERIAL PRIMARY KEY,
    taskname VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    userID INTEGER REFERENCES users(userID)
    )`;

    try {
        await db.query(sql); 
        console.log("Tasks table sucessfully created.");
    }catch(err) {
        console.error("Erro creating the table:", err);
    };
}

module.exports = router;