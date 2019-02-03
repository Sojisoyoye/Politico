const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => {
  console.log('Database connected');
});


/**
 * Create Party Table
 */
const createPartyTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    parties(
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(128) NOT NULL,
        hqAddress VARCHAR(128) NOT NULL,
        logoUrl VARCHAR(25) NOT NULL
    )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Office Table
 */
const createOfficeTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    offices(
        id SERIAL PRIMARY KEY NOT NULL,
        type VARCHAR(128) NOT NULL,
        name VARCHAR(128) NOT NULL
    )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

module.exports = { createPartyTable, createOfficeTable };

require('make-runnable');
