const express = require('express');
const logger = require('./logger');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const routerLogin  = require('./routes/login');
const routerTasks = require('./routes/tasks');
const routerReg = require('./routes/register');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({extended : false})); /* HTML form */
app.use(bodyParser.json()) /* API */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
    secret: 'to-do-app',
    resave: false,
    saveUninitialized: false,
  }))
app.use(express.static(path.join('frontend/login/public')));
app.use('/login', routerLogin);
app.use('/tasks', routerTasks);
app.use('/register', routerReg);

app.listen(PORT, () => {
    logger.info(`Server listening on Port: ${PORT}`);
});