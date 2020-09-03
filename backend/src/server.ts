import http from 'http';
import App from './app';
import { HOST, PORT } from './_config';

const Server = http.createServer(App);
Server.listen(parseInt(PORT || '3001'), HOST || 'localhost', undefined, () => {
	console.log(`App is running at ${HOST}:${PORT} in ${App.get('env')} mode`);
});
