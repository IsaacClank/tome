import React from 'react';

// JSX imports
import { Container, Row, Col, Button } from 'react-bootstrap';

// Hook & context imports
import AuthContext from 'libs/contexts/authContext';
import useFetch from 'libs/hooks/useFetch';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'libs/hooks/useForm';

// style imports
import styles from './authentication.module.scss';

// Env imports
import { SERVER_HOST, AUTH_API_SIGNIN, AUTH_API_SIGNUP } from 'libs/_config';

// ----------------------------------MAIN COMPONENT----------------------------------
// /account/authentication
// Provide a forms for signing in and registering
const Authentication = () => {
	const [type, setType] = React.useState(AuthenticationType.login); // Default form type
	const [authenticated, setAuthenticated] = React.useState(false); // authenticated state
	const authContext = React.useContext(AuthContext); // authentication context
	const router = useRouter();

	// Update authentication context if authenticated successfully
	React.useEffect(() => {
		authContext.changeAuthState(authenticated);
	}, [authContext, authenticated]);

	// Redirect to home page if authenticated
	React.useEffect(() => {
		if (authContext.authenticated) {
			router.replace('/');
		}
	}, [authContext.authenticated, router]);

	// Page component
	// Share local authenticated state with child components
	// Pass setType to AuthenticationSwitcher to handle switching between form types
	// Pass setAuthenticated to AuthenticatedFormRenderer to be called when authentication fetch is successfull
	return (
		<div id={styles.Content}>
			<Container fluid>
				<Row>
					<Col id={styles.FormWrapper} sm={12}>
						<div id={styles.AuthenticationForm}>
							{/* A switcher component for switching between form types */}
							<AuthenticationSwitcher current={type} switchAuthForm={setType} />
							{/* Form renderer based on switcher current form type */}
							<AuthenticationFormRenderer currentType={type} authChangeHandler={setAuthenticated} />
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default Authentication;
//
// -----------------------------CHILD COMPONENTS-----------------------------
//
// Types of authentication form
enum AuthenticationType {
	login = 'login',
	register = 'register',
}
//
// Authentication switcher
const AuthenticationSwitcher = (props: {
	current: string;
	switchAuthForm: (event: Event | any) => void;
}) => {
	// Handle form switching event
	const handleSwitch = (event: Event | any) => {
		switch (event.target.name) {
			case AuthenticationType.register:
				if (props.current !== AuthenticationType.register)
					props.switchAuthForm(AuthenticationType.register);
				break;
			case AuthenticationType.login:
				if (props.current !== AuthenticationType.login)
					props.switchAuthForm(AuthenticationType.login);
				break;
			default:
				break;
		}
	};

	// Component includes buttons
	// On button clicked, call switch handler
	return (
		<div id={styles.AuthSwitcher}>
			<Button
				className={props.current === AuthenticationType.login ? styles.selected : ''}
				name={AuthenticationType.login}
				onClick={handleSwitch}>
				Login
			</Button>
			<Button
				className={props.current === AuthenticationType.register ? styles.selected : ''}
				name={AuthenticationType.register}
				onClick={handleSwitch}>
				Register
			</Button>
		</div>
	);
};
//
// Renderer for current chose form type
const AuthenticationFormRenderer = (props: {
	currentType: string;
	authChangeHandler: (authenticated: boolean) => void;
}) => {
	// Render based on current form type
	switch (props.currentType) {
		case AuthenticationType.login:
			return <LoginForm AuthChangeHandler={props.authChangeHandler} />;
		case AuthenticationType.register:
			return <RegisterForm AuthChangeHandler={props.authChangeHandler} />;
		default:
			return <></>;
	}
};
//
// Login form component
const LoginForm = (props: { AuthChangeHandler: (authenticated: boolean) => void }) => {
	// Construct form using custom useForm hook
	// On submit, excute declared fetch object
	const [Form, FormValues] = useForm(
		{
			email: {
				name: 'email',
				type: 'email',
				value: '',
				required: true,
				placeholder: 'Email',
			},
			password: {
				name: 'password',
				type: 'password',
				placeholder: 'Password',
				required: true,
				value: '',
			},
			submit: {
				name: 'submit',
				type: 'submit',
				value: 'LOGIN',
			},
		},
		() => startFetch()
	);

	const [option, setOption] = React.useState<RequestInit>({
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(FormValues),
	});
	React.useEffect(() => {
		setOption({
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(FormValues),
		});
	}, [FormValues]);
	// Declare a fetch object to send form data to backend
	const [fetchState, startFetch] = useFetch(`${SERVER_HOST}${AUTH_API_SIGNIN}`, option);

	// Handle fetch result
	React.useEffect(() => {
		if (fetchState.status === 'RECEIVED') props.AuthChangeHandler(true); // update parrent component authenticated state
		if (fetchState.status === 'ERROR') console.error(fetchState.error);
	}, [fetchState, props]);

	return Form;
};
//
// Register form component
const RegisterForm = (props: { AuthChangeHandler: (authenticated: boolean) => void }) => {
	// Construct form using custom useForm hook
	// On form submit, execute fetch object
	const [Form, FormValues] = useForm(
		{
			email: {
				name: 'email',
				type: 'email',
				value: '',
				placeholder: 'Email',
			},
			username: {
				name: 'username',
				type: 'text',
				value: '',
				placeholder: 'Username',
				autocomplete: false,
			},
			password: {
				name: 'password',
				type: 'password',
				value: '',
				placeholder: 'Password',
			},
			confirmPassword: {
				name: 'confirmPassword',
				type: 'password',
				value: '',
				placeholder: 'Confirm your password',
				autocomplete: false,
			},
			submit: {
				name: 'submit',
				type: 'submit',
				value: 'REGISTER',
			},
		},
		() => startFetch()
	);

	const [option, setOption] = React.useState<RequestInit>({
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(FormValues),
	});
	React.useEffect(() => {
		setOption({
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(FormValues),
		});
	}, [FormValues]);
	// Declare fetch object with custom useFetch hook
	const [fetchState, startFetch] = useFetch(`${SERVER_HOST}${AUTH_API_SIGNUP}`, option);

	// Handle fetch result
	React.useEffect(() => {
		if (fetchState.status === 'RECEIVED') props.AuthChangeHandler(true); // update parrent authenticated state
		if (fetchState.status === 'ERROR') console.error(fetchState.error);
	}, [fetchState, props]);

	return Form;
};
