import { NextFunction, Request, Response, Router } from 'express';
import { parse } from 'querystring';
import { ServerResponse } from '../_types';
import * as LibraryService from '../services/library';

const router = Router();

//
// --------------------Middlewares-------------------- //
//
const parseQueryString = async (req: Request, res: Response, next: NextFunction) => {
	if (res.locals.err) return next();
	const queryString = req.url.match(/(?<=\?)\S+/g);
	if (!queryString) {
		res.locals.err = new ServerResponse(400, { error: 'MISSING INFO' });
	} else res.locals.queryObj = parse(queryString[0]);
	return next();
};

//
// --------------------Routing-------------------- //
//

router.get('/query', parseQueryString, async (req, res, next) => {
	if (!res.locals.err) {
		await LibraryService.searchBook(res.locals.queryObj)
			.then(data => (res.locals.rep = ServerResponse.compile(res.locals.rep, { data: data })))
			.catch(err => {
				if (ServerResponse.parse(err)) res.locals.err = err;
				else
					res.locals.err = new ServerResponse(500, {
						error: 'INTERNAL ERROR',
						detail: err,
					});
			});
	}
	return next();
});

export default router;
