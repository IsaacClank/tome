import { PlainObject } from 'libs/_types';
import { Dispatch, useEffect, useReducer, useState } from 'react';

// -------------------------------------- TYPE DEFINITION
//
// State object for fetch
interface DataState {
	error: PlainObject | null; // Current error object if fetch encoutered error
	data: PlainObject | null; // Data received if the fetch is successful
}

interface PostOptions {
	url: RequestInfo;
	option: RequestInit;
}

interface IPostState {
	data: PlainObject | null;
	error: PlainObject | null;
	action: {
		startFetch: () => void;
		setOption: Dispatch<{
			type?: 'url' | 'option';
			payload: PostOptions;
		}>;
	};
}

// -------------------------------------- FETCH HOOK
//
// usePost hook to send POST request. Post is triggered conditionally
const usePost = (): IPostState => {
	const [ready, setReady] = useState(false); // ready state
	const [fetchState, updateFetchState] = useReducer(fetchStateReducer, {
		error: null,
		data: null,
	}); // FetchState
	// Options for fetch
	const [fetchOptions, setFetchOptions] = useReducer(fetchOptionsReducer, {
		url: '',
		option: { method: 'POST' },
	});

	// Execute fetch
	useEffect(() => {
		// Fetch function
		const makeFetch = async () => {
			if (unmount) return;
			updateFetchState({ type: 'RESET', payload: {} });
			await fetch(fetchOptions.url, fetchOptions.option)
				.then(res => res.json())
				.then((data: PlainObject) => {
					if (data.error)
						updateFetchState({
							type: 'ERROR',
							payload: data.error,
						});
					else
						updateFetchState({
							type: 'DATA',
							payload: data,
						});
				})
				.catch(err => {
					updateFetchState({
						type: 'ERROR',
						payload: err,
					});
				});
		};
		let unmount = false;
		// Fetcher when ready=true
		if (ready) {
			makeFetch();
		}
		// Clean up
		return () => {
			setReady(false);
			unmount = true;
		};
	}, [fetchOptions, ready]);

	// Return FetchState and a function to set ready=true if immediate=false
	return {
		data: fetchState.data,
		error: fetchState.error,
		action: {
			startFetch: () => setReady(true),
			setOption: setFetchOptions,
		},
	};
};
export default usePost;

// -------------------------------------- UTILS
//

const fetchStateReducer = (
	state: DataState,
	action: { type: 'ERROR' | 'DATA' | 'RESET'; payload: PlainObject }
): DataState => {
	// dispatch logic
	switch (action.type) {
		case 'ERROR': // Fetch was executed and encounter error
			return { ...state, error: action.payload };
		case 'DATA': // Fetch was executed and received ok status
			return { ...state, data: action.payload };
		case 'RESET':
			return { data: null, error: null };
		default:
			return { ...state };
	}
};

const fetchOptionsReducer = (
	state: PostOptions,
	action: {
		type?: 'url' | 'option';
		payload: PostOptions;
	}
): PostOptions => {
	switch (action.type) {
		case 'url':
			return { ...state, url: action.payload.url };
		case 'option':
			return {
				...state,
				option: { ...state.option, ...action.payload.option },
			};
		default:
			return {
				...state,
				url: action.payload.url,
				option: { ...state.option, ...action.payload.option },
			};
	}
};
