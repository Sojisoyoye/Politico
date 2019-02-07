const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => {
});


/**
 * Create Party Table
 */
const createPartyTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  parties(
      id SERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(128) UNIQUE NOT NULL,
      hqAddress VARCHAR(128) NOT NULL,
      logoUrl VARCHAR(25) NOT NULL
  )`;

  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
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
      name VARCHAR(128) UNIQUE NOT NULL
  )`;

  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Create user table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  users(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    othername VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber INTEGER UNIQUE NOT NULL,
    passportUrl VARCHAR(255) UNIQUE NOT NULL,
    isAdmin BOOLEAN DEFAULT 'false'
  )`;

  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Create candidate table
 */
const createCandidateTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  candidates(
    id SERIAL NOT NULL,
    office INTEGER REFERENCES offices(id),
    party INTEGER REFERENCES parties(id),
    candidate INTEGER UNIQUE REFERENCES users(id),
  PRIMARY KEY(office, candidate)
  )`;

  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Create vote table
 */
const createVoteTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  votes(
    id SERIAL NOT NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT now(),
    createdBy INTEGER REFERENCES users(id),
    office INTEGER REFERENCES offices(id),
    candidate INTEGER REFERENCES candidates(candidate),
PRIMARY KEY(createdBy, office)
  )`;

  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Drop Party table
 */
const dropPartyTable = () => {
  const queryText = 'DROP TABLE IF EXISTS parties RETURNING *';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Drop Office table
 */
const dropOfficeTable = () => {
  const queryText = 'DROP TABLE IF EXISTS offices RETURNING *';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};


/**
 * Drop User table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users RETURNING *';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Drop Candidate table
 */
const dropCandidateTable = () => {
  const queryText = 'DROP TABLE IF EXISTS candidates RETURNING *';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Drop vote table
 */
const dropVoteTable = () => {
  const queryText = 'DROP TABLE IF EXISTS votes RETURNING *';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createPartyTable();
  createOfficeTable();
  createUserTable();
  createCandidateTable();
  createVoteTable();
};

/**
 * Create All Tables
 */
const dropAllTables = () => {
  dropPartyTable();
  dropOfficeTable();
  dropUserTable();
  dropCandidateTable();
  dropVoteTable();
};

pool.on('remove', () => {
  process.exit(0);
});

module.exports = {
  createPartyTable,
  createOfficeTable,
  createUserTable,
  createCandidateTable,
  createVoteTable,
  createAllTables,
  dropPartyTable,
  dropOfficeTable,
  dropUserTable,
  dropCandidateTable,
  dropVoteTable,
  dropAllTables,
};

require('make-runnable');
