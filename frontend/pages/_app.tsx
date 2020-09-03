import React from 'react';
import NavBar from 'components/NavBar';
import AuthContext from 'lib/contexts/AuthContext';
import { AppProps } from 'next/app';
// Env variables
import { SERVER, USER_API_INFO } from 'lib/constants';
// Style imports
import 'styles/globals.scss';

const App = (props: AppProps) => {
	const [Auth, setAuth] = React.useState(false);

	React.useEffect(() => {
		fetch(`${SERVER}${USER_API_INFO}`, { credentials: 'include' })
			.then(res => res.json())
			.then(res => (res.error ? Promise.reject(res.error) : setAuth(res.payload?.authenticated)))
			.catch(err => console.error(err));
	}, [Auth]);

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
