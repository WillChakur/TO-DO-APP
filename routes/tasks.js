const db = require('../db/index.js');
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
        await db(sql); 
        console.log("Tasks table sucessfully created.");
    }catch(err) {
        console.error("Error creating tasks table:", err);
    };
}
createTasksTable();

const addNewTask = async (values) => {
    let sql =   `INSERT INTO tasks(taskname, status, userID)
                 VALUES($1, $2, $3)`;

    try {
        await db(sql, values)
        console.log('New task added');
    }catch(err) {
        console.error('An error occurred while adding a new task', err);
    };  
};



router.post('/', (req, res) => {
    
})

module.exports = router;