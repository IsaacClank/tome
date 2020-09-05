import React from 'react';

import { AppProps } from 'next/app';
// JSX imports
import NavBar from 'components/navbar';
// Env imports
import { SERVER_HOST, AUTH_API } from 'libs/_config';
// Hook & context imports
import AuthContext from 'libs/contexts/authContext';
import useFetch from 'libs/hooks/useFetch';

import 'styles/globals.scss'; // Style imports

// Custom App componebnt
const App = (props: AppProps) => {
	// Authentication context initializing logic
	// Very bad code. Will be fixed soon
	const [Auth, setAuth] = React.useState(false);
	const [fetchOption] = React.useState({ credentials: 'include' } as RequestInit);
	const [fetchState, trigger] = useFetch(`${SERVER_HOST}${AUTH_API}`, fetchOption);

	React.useEffect(() => {
		trigger();
	}, [trigger]);

	React.useEffect(() => {
		if (fetchState?.status === 'RECEIVED') setAuth(fetchState.data.authenticated);
		if (fetchState?.status === 'ERROR') console.error(fetchState.error);
	}, [fetchState, trigger]);

	// App has layout has a fixed navigation bar on top. Page content is rendered below.
	// App use an Authentication context for checking authenticated state. Will possibly be replaced by a different solution
	return (
		<div id='App'>
			<AuthContext.Provider value={{ authenticated: Auth, changeAuthState: setAuth }}>
				<NavBar />
				{/* Content */}
				<props.Component {...props.pageProps} />
				{/*  */}
			</AuthContext.Provider>
		</div>
	);
};
export default App;
