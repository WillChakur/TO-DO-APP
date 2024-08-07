const db = require('../db/index.js');
const express = require('express');
const router = express.Router();
const path = require('path');

const createTasksTable = async () => {
    let sql = `CREATE TABLE IF NOT EXISTS tasks (
    taskID SERIAL PRIMARY KEY,
    taskname VARCHAR(50) NOT NULL,
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

router.use(express.static(path.join(__dirname, '..', 'todo', 'public')));

router.post('/',async (req, res) => {

    const { taskname , taskid } = req.body;

    let values = [ taskid, taskname, req.session.userID ];

    try {
        await addNewTask(values);
        res.status(201).json({ message: 'Task added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add task.', error: error.message });
    }
})

router.delete ('/delTasks/:id', async (req, res) => {
    let sql =   `DELETE FROM tasks
                 WHERE taskid = $1`

    let taskid = req.params.id;

    if(taskid) {
        try {
            await db (sql, [ taskid ])
            res.status(200).send({ message: 'tasks deleted with success' });
        }catch(err) {
            console.error(err)
            res.status(500).send({ message: 'Error deleting the tasks' });
        }
    }
})

router.get('/getTasks', async (req, res) => {

    let sql =   `SELECT * FROM tasks
                 WHERE userid = ($1)`;

    if (req.session.userID) {
    try {
        const tasks = await db(sql, [ req.session.userID ]);
        res.status(200).send({ data: tasks.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
    } else {
        res.status(200).send({ data: [], message: 'Empty list' });
    }
})

const addNewTask = async (values) => {
    let sql =   `INSERT INTO tasks(taskid, taskname, userID)
                 VALUES($1, $2, $3)`;
    try {
        await db(sql, values)
        console.log('New task added');
    }catch(err) {
        console.error('An error occurred while adding a new task', err);
    };  
};


module.exports = router;