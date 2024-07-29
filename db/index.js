/* Here we have a single module to manage the database interactions, going this way we significantly improve the maintainability and scalability of your application */
const pg = require('pg');

const { Pool } = pg;
 
const pool = new Pool({
    user: 'postgres',
    password: '64834923',
    host: 'localhost',
    port: 5432,
    database: 'TO-DO-APP-clients',
})

const query = async (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = query;
