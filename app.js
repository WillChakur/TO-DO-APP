const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const routerUser  = require('./routes/user');
const routerTasks = require('./routes/tasks');
const routerIndex = require('./routes/index');


const PORT = 3000;

app.use(bodyParser.urlencoded({extended : false})); /* HTML form */
app.use(bodyParser.json()) /* API */
app.use(cors());

app.use(express.static('register/public'))
app.use('/', routerIndex);
app.use('/user', routerUser);
app.use('/tasks', routerTasks);

app.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`);
});