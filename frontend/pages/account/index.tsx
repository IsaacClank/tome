import React from 'react';

// Hook & context imports
import AuthContext from 'libs/contexts/authContext';
import { useRouter } from 'next/dist/client/router';

// Style imports
import styles from './index.module.scss';
//
// ---------------------------------MAIN COMPONENT---------------------------------
//
// route: /account
const Account = () => {
	const { authenticated } = React.useContext(AuthContext);
	const router = useRouter();

	React.useEffect(() => {
		if (!authenticated) router.push({ pathname: '/account/authentication' });
	}, [authenticated, router]);

	return <div id={styles.Content}>Profile page</div>;
};

export default Account;
