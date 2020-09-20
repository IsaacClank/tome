import express from 'express';
import IndexRouter from './routes/index';
import AuthRouter from './routes/auth';
import LibROuter from './routes/lib';
import SessionManager from './services/session';
import { ServerResponse } from './_types';
import Cors from './services/cors';
import compression from 'compression';

const App = express();

App.use(Cors);
App.use(SessionManager);
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(compression());

// Compile response
App.use((_, res, next) => {
	res.locals.rep = new ServerResponse(200, {});
	return next();
});

// -------Routers-------
App.use('/', IndexRouter);
App.use('/auth', AuthRouter);
App.use('/lib', LibROuter);
//

// Error handler
App.use((_, res, next) => {
	const error = res.locals.err as ServerResponse;
	if (!error) return next();

	console.log();
	console.log('//--------------------------//');
	console.error(`ENCOUNTER ERROR:`);
	console.error(error.data);
	console.log('//--------------------------//');
	console.log();

	return res.status(error.status).json(error.data);
});
// Send response
App.use((_, res) => {
	const response = res.locals.rep as ServerResponse;
	if (response !== null) res.status(response?.status).json(response?.data);
});
export default App;
