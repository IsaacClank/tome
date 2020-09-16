import { AUTH_API, SERVER_HOST } from 'libs/_config';
import useSWR from 'swr';
import useFetcher from './useFetcher';

// Fetch authentication status
const useAuth = () => {
	const { fetcher } = useFetcher({ options: { credentials: 'include' } });
	return useSWR(`${SERVER_HOST}${AUTH_API}`, fetcher, { revalidateOnMount: true });
};
export default useAuth;
