import { Router } from 'express';
import { ServerResponse } from '../_types';

const router = Router();

router.get('/', (req, res, next) => {
	res.locals.rep = ServerResponse.compile(res.locals.rep, { message: 'Api entrance' });
	return next();
});

export default router;
