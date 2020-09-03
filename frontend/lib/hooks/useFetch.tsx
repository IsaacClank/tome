import { PlainObject } from 'lib/_types';
import { useEffect, useReducer, useState } from 'react';

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
//
// Prop interface returned by this Custom Hook
interface FetchProps {
	fetchState: FetchState; // current FetchState
	startFetch: () => void; // function to execute the fetch
}
//
// --------------------------------------FETCH HOOK--------------------------------------
//
// Custom useFetch hook. Aim to support conditional fetch execution that depends on internal states
// Return type FetchState. Provide information/data about the fetch status and api/server response
// Same parameter interface as fetch api
// Also accept an optional 'immediate' boolean parameter.
// Useful if the fetch only need to run once and/or doesn't depend of other states
const useFetch = (
	url: Parameters<typeof fetch>[0],
	options: Parameters<typeof fetch>[1] = {},
	immediate: boolean = false
): FetchProps => {
	// Ready state, fetch is executed if ready=true
	const [ready, setReady] = useState(false);
	// FetchState state
	// Choose UseReducer to provide more flexible state update logics
	const [fetchState, dispatch] = useReducer(
		(state: FetchState, action: { status: FetchStatus; payload?: PlainObject }): FetchState => {
			// dispatch logic
			switch (action.status) {
				case FetchStatus.fetching: // Fetch was executed and waiting
					return { ...state, status: FetchStatus.fetching };
				case 'ERROR': // Fetch was executed and encounter error
					return { ...state, status: FetchStatus.error, data: action.payload ?? {} };
				case 'RECEIVED': // Fetch was executed and received ok status
					return { ...state, status: FetchStatus.received, data: action.payload ?? {} };
				default:
					return state;
			}
		},
		{ status: FetchStatus.idle, error: {}, data: {} } // initialize value for FetchState
	);

	// Fetch execution
	useEffect(() => {
		let unmount = false; // prevent component state update while unmount error
		// Fetch function
		const makeFetch = async () => {
			dispatch({ status: FetchStatus.fetching }); // set fetch status to fetching
			// Perform fetch if component is not unmounted
			if (!unmount)
				await fetch(url, options)
					.then(res => res.json())
					.then((data: PlainObject) => {
						// Update FetchState based on fetch result
						if (data.error)
							return dispatch({ status: FetchStatus.error, payload: data.error });
						else return dispatch({ status: FetchStatus.received, payload: data });
					});
		};

		// Fetch if component is mounted and immediate=true
		// Or if component is mounted and ready=true
		if (!unmount && (immediate || ready)) makeFetch();

		return () => {
			// Clean up
			unmount: true;
			setReady(false);
		};
	}, [ready]);

	// Return FetchState and a function to set ready=true if immediate=false
	return { fetchState: fetchState, startFetch: immediate ? () => {} : () => setReady(true) };
};
export default useFetch;
