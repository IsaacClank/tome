import React from 'react';

import { AppProps } from 'next/app';
// JSX imports
import NavBar from 'components/navbar';
import Head from 'next/head';

import 'styles/globals.scss'; // Style imports

// Custom App componebnt
const App = (props: AppProps) => {
	// App has layout has a fixed navigation bar on top. Page content is rendered below.
	// App use an Authentication context for checking authenticated state. Will possibly be replaced by a different solution
	return (
		<>
			<Head key={1}>
				<title>Tome Library</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<div id='App'>
				<NavBar />
				{/* Content */}
				<props.Component {...props.pageProps} />
				{/*  */}
			</div>
		</>
	);
};
export default App;
