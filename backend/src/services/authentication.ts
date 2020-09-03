import { v4 } from 'uuid';
import { query } from './database';
import { BCRYPT_SALT } from '../_config';
import { hash, compare, genSalt } from 'bcryptjs';
import { PlainObject, ServerResponse } from '../_types';

type User = {
	email?: string;
	username?: string;
	password?: string;
};

export const signUp = async (user: User): Promise<PlainObject | ServerResponse> => {
	if (!(user.email && user.password && user.username))
		return Promise.reject(new ServerResponse(400, { error: 'MISSING INFORMATION' }));
	// prepare query statement
	const statement = `INSERT INTO accounts(_id, username, email, password) VALUES($1,$2,$3,$4) RETURNING email, username`;
	const params = [generateID(), user.username, user.email, await hashPassword(user.password)];
	// make query
	return query(statement, params).then(result => result.rows[0]);
};

export const signIn = async (user: User): Promise<PlainObject | ServerResponse> => {
	if (!(user.email || user.password))
		return Promise.reject(new ServerResponse(400, { error: 'MISSING INFORMATION' }));
	// prepare query statement
	const statement = 'SELECT * FROM accounts WHERE email=$1';
	const params = [user.email];
	// make query
	return query(statement, params).then(async result => {
		// check for wrong email or password
		if (!result.rowCount) return Promise.reject(new ServerResponse(400, { error: 'NO MATCHING EMAIL' }));
		if (!(await checkPassword(user.password!, result.rows[0].password)))
			return Promise.reject(new ServerResponse(400, { error: 'WRONG PASSWORD' }));
		// return email and username
		return {
			email: result.rows[0].email,
			username: result.rows[0].username,
		};
	});
};

// ---------------------------UTILS---------------------------

const hashPassword = async (password: string): Promise<string> =>
	genSalt(parseInt(BCRYPT_SALT || '10')).then(salt => hash(password, salt));

const checkPassword = (uncheckedPassword: string, hashedPassword: string): Promise<boolean> =>
	compare(uncheckedPassword, hashedPassword);

const generateID = (): string => v4();
