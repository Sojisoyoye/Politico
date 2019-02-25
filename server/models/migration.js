import bcrypt from 'bcrypt';
import pool from './connect';

const partiesTable = `CREATE TABLE IF NOT EXISTS
parties(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(128) UNIQUE NOT NULL,
    hqAddress VARCHAR(128) NOT NULL,
    logoUrl VARCHAR(25) NOT NULL
);`;

const officesTable = `CREATE TABLE IF NOT EXISTS
offices(
    id SERIAL PRIMARY KEY NOT NULL,
    type VARCHAR(128) NOT NULL,
    name VARCHAR(128) UNIQUE NOT NULL
);`;

const usersTable = `CREATE TABLE IF NOT EXISTS
users(
  id SERIAL PRIMARY KEY NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  othername VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(255) NOT NULL,
  passportUrl VARCHAR(255),
  isAdmin VARCHAR(255) DEFAULT 'false'
);`;

const candidatesTable = `CREATE TABLE IF NOT EXISTS
candidates(
  id SERIAL NOT NULL,
  office INTEGER REFERENCES offices(id),
  party INTEGER REFERENCES parties(id),
  candidate INTEGER UNIQUE REFERENCES users(id),
PRIMARY KEY(office, candidate)
);`;

const votesTable = `CREATE TABLE IF NOT EXISTS
votes(
  id SERIAL NOT NULL,
  createdOn TIMESTAMP WITH TIME ZONE DEFAULT now(),
  createdBy INTEGER REFERENCES users(id),
  office INTEGER REFERENCES offices(id),
  candidate INTEGER REFERENCES candidates(candidate),
PRIMARY KEY(createdBy, office)
);`;

(async () => {
  console.time('seeding completed in');
  const userPassword = '123456';
  const adminPassword = '123456';
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  await pool.query(`${usersTable}`);
  await pool.query(`INSERT INTO users(firstname, lastname, email, password, phoneNumber) 
  VALUES('user', 'user', 'user@email.com', '${hashedUserPassword}', '08011221122')`);
  await pool.query(`INSERT INTO users(firstname, lastname, email, password, phoneNumber)
  VALUES('admin', 'admin', 'admin@email.com', '${hashedAdminPassword}', '08011221122')`);
  await pool.query('UPDATE users SET isadmin = TRUE WHERE id = 2');
  await pool.query(`${partiesTable}`);
  await pool.query(`INSERT INTO parties(name, hqAddress, logoUrl)
  VALUES('party of nigeria', '1, party road, nigeria', 'www.party.com')`);
  await pool.query(`${officesTable}`);
  await pool.query(`INSERT INTO offices(type, name)
  VALUES('federal', 'president')`);
  await pool.query(`${candidatesTable}`);
  await pool.query(`INSERT INTO candidates(office, party, candidate)
  VALUES(1, 1, 1)`);
  await pool.query(`${votesTable}`);
  await pool.query(`INSERT INTO votes(createdBy, office, candidate)
  VALUES(1, 1, 1)`);
  console.timeEnd('seeding completed in');
})();
