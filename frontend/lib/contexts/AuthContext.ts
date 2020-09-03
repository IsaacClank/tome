import { createContext } from 'react';

const AuthContext = createContext({
	authenticated: false,
	changeAuthState: (isAuth: boolean) => {},
});
export default AuthContext;
