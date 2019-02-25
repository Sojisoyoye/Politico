import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const environment = process.env.NODE_ENV;

const connectionURI = environment === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
/* instabul ignore next */
const pool = new Pool({ connectionString: connectionURI });

export default pool;
