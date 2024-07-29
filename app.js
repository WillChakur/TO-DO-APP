const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routerUser = require('./routes/user');
const routerTasks = require('./routes/tasks');

const PORT = 3000;

app.use(bodyParser.urlencoded({extended : false})); /* HTML form */
app.use(bodyParser.json()) /* API */

app.use('/user', routerUser);
app.use('/tasks', routerTasks);

app.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`);
});