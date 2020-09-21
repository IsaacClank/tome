import { PlainObject } from 'libs/_types';
import { Dispatch, SetStateAction, useEffect, useReducer, useState } from 'react';

//
// --------------------------------------TYPE DEFINITION--------------------------------------
//
// Type of fetch status
enum FetchStatus {
	idle = 'IDLE',
	fetching = 'FETCHING',
	error = 'ERROR',
	received = 'RECEIVED',
}
//
// State object for fetch
interface FetchState {
	status: FetchStatus; // Describe current state of the fetch
	error: PlainObject; // Current error object if fetch encoutered error
	data: PlainObject; // Data received if the fetch is successful
}

interface FetchAction {
	startFetch: () => void;
	setUrl: Dispatch<SetStateAction<RequestInfo>>;
	setOption: Dispatch<SetStateAction<RequestInit>>;
}

//
// --------------------------------------FETCH HOOK--------------------------------------
//
// Custom useFetch hook. Aim to support conditional fetch execution that depends on internal states
// Return type FetchState. Provide information/data about the fetch status and api/server response
// Same parameter interface as fetch api
// Also accept an optional 'immediate' boolean parameter.
// Useful if the fetch only need to run once and/or doesn't depend of other states
const useFetch = (): [FetchState, FetchAction] => {
	// FetchState state
	const [fetchState, updateFetchState] = useReducer(
		fetchStateReducer,
		{ status: FetchStatus.idle, error: {}, data: {} } // initialize value for FetchState
	);
	const [fetchUrl, setFetchUrl] = useState<RequestInfo>('');
	const [fetchOption, setFetchOption] = useState<RequestInit>({});
	const [ready, setReady] = useState(false);

	// Execute fetch
	useEffect(() => {
		// Fetch function
		const makeFetch = async () => {
			// Perform fetch if component is not unmounted
			if (unmount) return;
			updateFetchState({ status: FetchStatus.fetching }); // set fetch status to fetching
			await fetch(fetchUrl, fetchOption)
				.then(res => res.json())
				.then((data: PlainObject) => {
					if (data.error)
						updateFetchState({
							status: FetchStatus.error,
							payload: data.error,
						});
					else
						updateFetchState({
							status: FetchStatus.received,
							payload: data,
						});
				})
				.catch(err => {
					updateFetchState({
						status: FetchStatus.error,
						payload: err,
					});
				});
		};

		let unmount = false; // prevent component state update while unmount
		if (ready) {
			makeFetch();
		}

		// Clean up
		return () => {
			setReady(false);
			unmount = true;
		};
	}, [fetchOption, fetchUrl, ready]);

	// Return FetchState and a function to set ready=true if immediate=false
	return [
		fetchState,
		{ startFetch: () => setReady(true), setOption: setFetchOption, setUrl: setFetchUrl },
	];
};
export default useFetch;

//
// -----------------------------------------UTILS-----------------------------------------
//

const fetchStateReducer = (
	state: FetchState,
	action: { status: FetchStatus; payload?: PlainObject }
): FetchState => {
	// dispatch logic
	switch (action.status) {
		case FetchStatus.fetching: // Fetch was executed and waiting
			return { ...state, status: FetchStatus.fetching };
		case 'ERROR': // Fetch was executed and encounter error
			return { ...state, status: FetchStatus.error, error: action.payload ?? {} };
		case 'RECEIVED': // Fetch was executed and received ok status
			return { ...state, status: FetchStatus.received, data: action.payload ?? {} };
		default:
			return { ...state };
	}
};
