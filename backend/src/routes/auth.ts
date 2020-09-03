import { NextFunction, Request, Response, Router } from 'express';
import { ServerResponse } from '../_types';
import * as AuthService from '../services/authentication';

const router = Router();

//
// -----------------------------MIDDLEWARE-----------------------------//
//

const parseUserAuthentication = (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.err)
		res.locals.user = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		};
	return next();
};

const checkAuthenticatedRequirement = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session?.user)
		res.locals.err = new ServerResponse(401, {
			error: 'USER IS NOT AUTHENTICATED',
			detail: 'User is required to be signed in to perform this action',
		});
	return next();
};

const updateSession = (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.err && req.session) {
		const options = res.locals.sess;
		if (options.refresh)
			req.session?.regenerate(err => {
				if (err)
					res.locals.error = new ServerResponse(500, {
						error: 'ERROR WHILE UPDATING SESSION',
						detail: err,
					});
			});
		if (options.destroy)
			req.session?.destroy(err => {
				if (err)
					res.locals.error = new ServerResponse(500, {
						error: 'ERROR WHILE UPDATING SESSION',
						detail: err,
					});
			});
		req.session.user = options.user && options.user;
		req.session.data = options.data && options.data;
		res.locals.rep = ServerResponse.compile(res.locals.rep, {
			authenticated: req.session?.user ? true : false,
		});
	}
	return next();
};

//
// -----------------------------ROUTING-----------------------------//
//

router.get('/', (req, res, next) => {
	res.locals.rep = ServerResponse.compile(res.locals.rep, {
		authenticated: req.session?.user ? true : false,
	});
	return next();
});

router.post(
	'/signup',
	parseUserAuthentication,
	// Signup middleware
	async (req, res, next) => {
		if (!res.locals.err)
			await AuthService.signUp(res.locals.user)
				.then(response => {
					res.locals.rep = ServerResponse.compile(res.locals.rep, response);
					res.locals.sess = { refresh: true, user: response };
				})
				.catch((err: unknown) => {
					if (ServerResponse.parse(err)) res.locals.err = err;
					else
						res.locals.err = new ServerResponse(500, {
							error: 'INTERNAL ERROR',
							detail: err,
						});
				});

		return next();
	},
	updateSession
);

router.post(
	'/signin',
	parseUserAuthentication,
	// Signin middleware
	async (req, res, next) => {
		if (!res.locals.err)
			await AuthService.signIn(res.locals.user)
				.then(response => {
					res.locals.rep = ServerResponse.compile(res.locals.rep, response);
					res.locals.sess = { refresh: true, user: response };
				})
				.catch((err: unknown) => {
					if (ServerResponse.parse(err)) res.locals.err = err;
					else
						res.locals.err = new ServerResponse(500, {
							error: 'INTERNAL ERROR',
							detail: err,
						});
				});

		return next();
	},
	updateSession
);

router.get(
	'/signout',
	checkAuthenticatedRequirement,
	// Call updateSession() to sign user out
	(req, res, next) => {
		if (!res.locals.err) {
			res.locals.sess = { refresh: true };
			res.locals.rep = ServerResponse.compile(res.locals.rep, {
				message: 'USER IS NOW SIGNED OUT',
			});
		}
		return next();
	},
	updateSession
);

export default router;
