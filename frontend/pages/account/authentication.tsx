import { useForm } from 'lib/hooks/UseForm';
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './authentication.module.scss';

const Authentication = () => {
	const [type, setType] = React.useState('login');

	const authChangeHandler = () => {
		console.log('User is authenticated');
	};

	return (
		<div id={styles.Content}>
			<Container fluid>
				<Row>
					<Col id={styles.FormWrapper} sm={12}>
						<div id={styles.AuthenticationForm}>
							<AuthenticationSwitcher current={type} switchAuthForm={setType} />
							<AuthenticationFormRenderer currentType={type} authChangeHandler={authChangeHandler} />
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Authentication;

//
// ---------------------Page Components---------------------//
//

enum AuthenticationType {
	login = 'login',
	register = 'register',
}

const AuthenticationSwitcher = (props: { current: string; switchAuthForm: (event: Event | any) => void }) => {
	const handleSwitch = (event: Event | any) => {
		switch (event.target.name) {
			case AuthenticationType.register:
				if (props.current !== AuthenticationType.register) props.switchAuthForm(AuthenticationType.register);
				break;
			case AuthenticationType.login:
				if (props.current !== AuthenticationType.login) props.switchAuthForm(AuthenticationType.login);
				break;
			default:
				break;
		}
	};

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

export const AuthenticationFormRenderer = (props: { currentType: string; authChangeHandler: () => void }) => {
	switch (props.currentType) {
		case AuthenticationType.login:
			return <LoginForm AuthChangeHandler={props.authChangeHandler} />;
		case AuthenticationType.register:
			return <RegisterForm AuthChangeHandler={props.authChangeHandler} />;
		default:
			return <></>;
	}
};

const LoginForm = (props: { AuthChangeHandler: () => void }) => {
	const template: Parameters<typeof useForm>[0] = {
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
	};

	const [Form, FormValues] = useForm(template, () => console.log(FormValues));

	return Form;
};

const RegisterForm = (props: { AuthChangeHandler: () => void }) => {
	const template: Parameters<typeof useForm>[0] = {
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

	const [Form, FormValues] = useForm(template, () => console.log(FormValues));

	return Form;
};
