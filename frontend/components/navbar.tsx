import React from 'react';
import Link from 'next/link';

// JSX Import
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Hook & contenxt imports
import AuthContext from 'libs/contexts/authContext';
import useFetch from 'libs/hooks/useFetch';
import { useRouter } from 'next/dist/client/router';

import { SERVER_HOST, AUTH_API_SIGNOUT } from 'libs/_config'; // env import
import styles from 'components/navbar.module.scss'; // Style import

const NavBar = () => {
	const { authenticated } = React.useContext(AuthContext);
	return (
		<div className={styles.fixed}>
			<Container fluid id={styles.NavBar}>
				<Row>
					<Col id={styles.Brandname} xs={12} lg={2} xl={1}>
						{/* Brand Name */}
						<Link href='/'>
							<a>
								<h1>TOME</h1>
							</a>
						</Link>
					</Col>
					<Col id={styles.Navlink} xs={12} lg={6} xl={4}>
						<NavLink />
					</Col>
					<Col id={styles.UserOptions} xs={12} lg={4} xl={{ offset: 6, span: 1 }}>
						{authenticated ? (
							<UserOptions />
						) : (
							<Link href='/account/authentication'>
								<a>
									<button className={styles.navItem}>Login</button>
								</a>
							</Link>
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NavBar;

// ------------------------UTILS------------------------

// User options
const UserOptions = () => {
	const [active, setActive] = React.useState(false);
	const [options] = React.useState<RequestInit>({
		credentials: 'include',
	});
	const [fetchState, startFetch] = useFetch(`${SERVER_HOST}${AUTH_API_SIGNOUT}`, options);
	const Router = useRouter();

	React.useEffect(() => {
		if (fetchState.status === 'RECEIVED') Router.reload();
	}, [fetchState, Router]);

	return (
		<div className={styles.dropdown}>
			<button
				onClick={() => setActive(!active)}
				className={`${styles.toggler} ${active ? styles.active : ''}`}>
				<FontAwesomeIcon icon={faUser} />
			</button>
			<div className={`${styles.content} ${active ? styles.active : ''}`}>
				<ul>
					<li>
						<Link href='/account'>
							<a>
								<button>Profile</button>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/library'>
							<a>
								<button>Library</button>
							</a>
						</Link>
					</li>
					<li>
						<button onClick={startFetch}>Sign Out</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

// Navigation link
const NavLink = () => {
	return (
		<>
			<Link href='/'>
				<a>
					<button className={styles.navItem}>Home</button>
				</a>
			</Link>
			<Link href='/browse'>
				<a>
					<button className={styles.navItem}>Browse</button>
				</a>
			</Link>
			<Link href='/about'>
				<a>
					<button className={styles.navItem}>About</button>
				</a>
			</Link>
		</>
	);
};
