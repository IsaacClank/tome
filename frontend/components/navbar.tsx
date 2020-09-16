// Functionality
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import useLoader from 'libs/hooks/useLoader';
import useAuth from 'libs/hooks/useAuth';
import useSWR from 'swr';
import useFetcher from 'libs/hooks/useFetcher';
// JSX
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
// Configs
import { AUTH_API_SIGNOUT, SERVER_HOST } from 'libs/_config';
// Style
import styles from 'components/navbar.module.scss';

// ---------------------------------------------- MAIN COMPONENT
//
// Navigation bar
const NavBar = () => {
	const { data } = useAuth(); // get auth state
	// loader logic for protected button
	const userButton = useLoader(data?.authenticated, {
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
					<Col
						id={styles.UserOptions}
						xs={12}
						lg={4}
						xl={{ offset: 6, span: 1 }}>
						{userButton as JSX.Element}
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NavBar;

// ---------------------------------------------- UTILS
//
// Protected user button
const UserOptions = () => {
	const Router = useRouter(); // router object
	const [active, setActive] = React.useState(false); // dropdown state
	const [isSigningOut, setSigningOut] = React.useState(false); // on signout button clicked, isSigningOut = true
	const { fetcher } = useFetcher({ options: { credentials: 'include' } }); // fetcher for swr

	// send signout fetch after signout button is clicked
	const { data } = useSWR(
		isSigningOut ? `${SERVER_HOST}${AUTH_API_SIGNOUT}` : null,
		fetcher
	);

	// Refresh page after signing out successfully
	if (data && data.authenticated === false) Router.reload();

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
						<button onClick={() => setSigningOut(true)}>Sign Out</button>
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
