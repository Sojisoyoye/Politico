import pool from './connect';

(async () => {
  console.time('dropping completed in');
  await pool.query('DROP TABLE users CASCADE');
  await pool.query('DROP TABLE parties CASCADE');
  await pool.query('DROP TABLE offices CASCADE');
  await pool.query('DROP TABLE candidates CASCADE');
  await pool.query('DROP TABLE votes CASCADE');
  console.timeEnd('dropping completed in');
})();
