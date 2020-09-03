import { createContext } from 'react';

// Authentication context
// Is used to check authentication state
// Not satisfactory result. Will possibly be replaced in the future
const AuthContext = createContext({
	authenticated: false,
	changeAuthState: (isAuth: boolean) => {},
});
export default AuthContext;
