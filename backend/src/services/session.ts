import session from 'express-session';
import { SESSION_SECRET } from '../_config';
import pool from './database';

const SessionManager = session({
	secret: String(SESSION_SECRET),
	resave: false,
	saveUninitialized: false,
	name: 'CatJam Cookie',
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
		sameSite: 'lax',
	},
	store: new (require('connect-pg-simple')(session))({
		pool: pool,
		tableName: 'session',
	}),
});
export default SessionManager;
