import { AUTH_API, SERVER_HOST } from 'libs/_config';
import useSWR from 'swr';

const useAuth = () => {
	const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());
	return useSWR(`${SERVER_HOST}${AUTH_API}`, fetcher, { revalidateOnMount: true });
};
export default useAuth;
