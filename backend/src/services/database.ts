import { Pool } from 'pg';
import { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } from '../_config';

const pool = new Pool({
	host: PG_HOST || 'localhost',
	port: parseInt(PG_PORT || '5432'),
	database: PG_DATABASE,
	user: PG_USER,
	password: PG_PASSWORD,
});
export default pool;

export const query = (statement: string, params: any[]) => pool.query(statement, params);
export const getClient = () => pool.connect();
