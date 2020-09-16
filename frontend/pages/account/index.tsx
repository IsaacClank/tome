// Functionality
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import useAuth from 'libs/hooks/useAuth';
import useLoader from 'libs/hooks/useLoader';
// JSX
import Loading from 'components/Loading';
// Style
import styles from './index.module.scss';
//
// ---------------------------------MAIN COMPONENT---------------------------------
//
// route: /account
const Account = () => {
	const { data } = useAuth(); // confirm auth state
	const router = useRouter(); // router object

	// Loader logic
	const Page = useLoader(data?.authenticated, {
		dest: () => (
			<div id={styles.Content}>
				<h1>Profile Page</h1>
			</div>
		),
		load: () => <Loading />,
		alt: () => {
			router.replace({ pathname: '/account/authentication' });
			return <div></div>;
		},
	});

	return <>{Page}</>;
};

export default Account;
