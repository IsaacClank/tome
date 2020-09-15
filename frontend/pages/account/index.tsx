import React from 'react';

// Hook & context imports
import { useRouter } from 'next/dist/client/router';

// Style imports
import styles from './index.module.scss';
import useAuth from 'libs/hooks/useAuth';
import useLoader from 'libs/hooks/useLoader';
import Loading from 'components/Loading';
//
// ---------------------------------MAIN COMPONENT---------------------------------
//
// route: /account
const Account = () => {
	const { data } = useAuth();
	const router = useRouter();
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
