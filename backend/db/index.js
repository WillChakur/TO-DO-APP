/* Here we have a single module to manage the database interactions, going this way we significantly improve the maintainability and scalability of your application */
const pg = require('pg');
require('dotenv').config();

const { Pool } = pg;
 
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionString: process.env.DB_CONNECTION,
})

const query = async (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = query;
