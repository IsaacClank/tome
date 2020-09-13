import React from 'react';
import Link from 'next/link';

// JSX Import
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Hook & contenxt imports
import useFetch from 'libs/hooks/useFetch';
import { useRouter } from 'next/dist/client/router';
import useLoader from 'libs/hooks/useLoader';

import { AUTH_API_SIGNOUT, SERVER_HOST } from 'libs/_config'; // env import
import styles from 'components/navbar.module.scss'; // Style import
import useAuth from 'libs/hooks/useAuth';

const NavBar = () => {
	const { data } = useAuth();
	const status = useLoader(data?.authenticated, {
		// eslint-disable-next-line react/display-name
		alt: () => {
			return (
				<Link href='/account/authentication'>
					<a>
						<button className={styles.navItem}>Login</button>
					</a>
				</Link>
			);
		},
		dest: () => <UserOptions />,
	});

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
						{status as JSX.Element}
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
	const [fetchState, fetchAction] = useFetch();
	const Router = useRouter();

	const onButtonClick = () => {
		fetchAction.setUrl(`${SERVER_HOST}${AUTH_API_SIGNOUT}`);
		fetchAction.setOption({ credentials: 'include' });
		fetchAction.startFetch();
	};

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
						<button onClick={onButtonClick}>Sign Out</button>
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
