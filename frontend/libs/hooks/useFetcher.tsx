import { Dispatch, SetStateAction, useReducer, useState } from 'react';

interface FetcherState {
	fetcher: (url: string) => Promise<any>;
	setFetchOption: Dispatch<RequestInit>;
	setErrorHandler: Dispatch<SetStateAction<((data: any) => any) | null>>;
}

interface IFetcherProps {
	options?: RequestInit;
	errorHandler?: (data: any) => any;
}

// Fetcher factory for SWR
const useFetcher = (props?: IFetcherProps): FetcherState => {
	const [fetchOption, dispatchFetchOption] = useReducer((state: RequestInit, payload: RequestInit): RequestInit => {
		return { ...state, ...payload };
	}, props?.options || {});
	const [errorHandler, setErrorHandler] = useState(() => props?.errorHandler || null);

	const fetcher = (url: string) =>
		fetch(url, fetchOption)
			.then(r => r.json())
			.then(data => (errorHandler ? errorHandler(data) : data));
	return {
		fetcher: fetcher,
		setFetchOption: dispatchFetchOption,
		setErrorHandler: setErrorHandler,
	};
};

export default useFetcher;
