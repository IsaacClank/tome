import c from 'cors';
import { NEXT_HOST } from '../_config';

const CorsOptions: c.CorsOptions | c.CorsOptionsDelegate = {
	origin: `${NEXT_HOST}`,
	optionsSuccessStatus: 200,
	credentials: true,
};

const Cors = c(CorsOptions);
export default Cors;
