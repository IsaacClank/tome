// Funtionality
import React from 'react';
import { mutate } from 'swr';
import useAuth from 'libs/hooks/useAuth';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'libs/hooks/useForm';
import useLoader from 'libs/hooks/useLoader';
import usePost from 'libs/hooks/usePost';
// JSX
import { Container, Row, Col, Button } from 'react-bootstrap';
import Loading from 'components/Loading';
// style
import styles from './authentication.module.scss';
// Env
import {
	SERVER_HOST,
	AUTH_API_SIGNIN,
	AUTH_API_SIGNUP,
	AUTH_API,
} from 'libs/_config';

// ---------------------------------- MAIN COMPONENT
//

// Provide forms for signing in and registering
const Authentication = () => {
	const [type, setType] = React.useState(AuthenticationType.login); // Default form type
	const { data } = useAuth(); // fetch auth info
	const router = useRouter(); // router object

	// Handle redirect after succesfully authenticated
	const authChangeHandler = (error?: any) => {
		if (error) {
			console.error(error);
		} else {
			mutate(`${SERVER_HOST}${AUTH_API}`);
			router.replace('/');
		}
	};

	// Loader logic
	const page = useLoader(data?.authenticated, {
		load: () => <Loading />,
		// Redirect because already authenticated
		dest: () => {
			router.replace({ pathname: '/' });
			return <div></div>;
		},
		// Main Page component. Render if not authenticated
		alt: () => (
			<div id={styles.Content}>
				<Container fluid>
					<Row>
						<Col id={styles.FormWrapper} sm={12}>
							<div id={styles.AuthenticationForm}>
								{/* A switcher component for switching between form types */}
								<AuthenticationSwitcher
									current={type}
									switchAuthForm={setType}
								/>
								{/* Form renderer based on current form type */}
								<HandlerContext.Provider value={authChangeHandler}>
									<AuthenticationFormRenderer currentType={type} />
								</HandlerContext.Provider>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		),
	});

	return <>{page}</>;
};
export default Authentication;

// ---------------------------------- CHILD COMPONENTS
//

// Types of authentication form
enum AuthenticationType {
	login = 'login',
	register = 'register',
}

// Authentication switcher
const AuthenticationSwitcher = (props: {
	current: string;
	switchAuthForm: (event: Event | any) => void;
}) => {
	// Handle form switching
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
				className={
					props.current === AuthenticationType.login ? styles.selected : ''
				}
				name={AuthenticationType.login}
				onClick={handleSwitch}>
				Login
			</Button>
			<Button
				className={
					props.current === AuthenticationType.register ? styles.selected : ''
				}
				name={AuthenticationType.register}
				onClick={handleSwitch}>
				Register
			</Button>
		</div>
	);
};

// Renderer for current form type
const AuthenticationFormRenderer = (props: { currentType: string }) => {
	// Render based on current form type
	switch (props.currentType) {
		case AuthenticationType.login:
			return <LoginForm />;
		case AuthenticationType.register:
			return <RegisterForm />;
		default:
			return <div></div>;
	}
};

// Login form component
const LoginForm = () => {
	const { data, error, action } = usePost();
	const AuthChangeHandler = React.useContext(HandlerContext);

	// Construct form. On form submit, execute fetch
	const [Form] = useForm(constructAuthenticationForm('signin'), FormValues => {
		action.setOption({
			payload: {
				url: `${SERVER_HOST}${AUTH_API_SIGNIN}`,
				option: {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(FormValues),
				},
			},
		});
		action.startFetch();
	});

	// Handle POST response
	React.useEffect(() => {
		if (data || error) AuthChangeHandler(error);
	}, [AuthChangeHandler, data, error]);

	return Form;
};

// Register form component
const RegisterForm = () => {
	const { data, error, action } = usePost();
	const AuthChangeHandler = React.useContext(HandlerContext);

	// Construct form. On form submit, set ready=true
	const [Form] = useForm(constructAuthenticationForm('signup'), FormValues => {
		action.setOption({
			payload: {
				url: `${SERVER_HOST}${AUTH_API_SIGNUP}`,
				option: {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(FormValues),
				},
			},
		});
		action.startFetch();
	});

	// Handle POST response
	React.useEffect(() => {
		if (data || error) AuthChangeHandler(error);
	}, [AuthChangeHandler, data, error]);

	return Form;
};

// ---------------------------------- UTILS
//

// Handler context cho handle authentication change
const HandlerContext = React.createContext((error?: any) => {
	if (error) console.log(error);
	console.log('context was not initialized');
});

// Return object for constructing form based on type parameter
const constructAuthenticationForm = (
	type: 'signin' | 'signup'
): Parameters<typeof useForm>[0] => {
	return type === 'signin'
		? {
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
		  }
		: {
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
		  };
};
