import React from 'react';
import AuthContext from 'lib/contexts/AuthContext';
import { useRouter } from 'next/dist/client/router';

const Account = () => {
	const { authenticated } = React.useContext(AuthContext);
	const router = useRouter();

	React.useEffect(() => {
		if (!authenticated) router.push({ pathname: '/account/authentication' });
	}, []);

	return <div>hello</div>;
};

export default Account;
