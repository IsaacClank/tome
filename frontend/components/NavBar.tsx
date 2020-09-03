import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';
import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from 'components/NavBar.module.scss';
import AuthContext from 'lib/contexts/AuthContext';

const NavBar = () => {
	const { authenticated } = React.useContext(AuthContext);

	return (
		<Container fluid id={styles.NavBar}>
			<Row>
				<Col id={styles.Brandname} xs={12} lg={2} xl={1}>
					<Link href='/'>
						<a>
							<h1>TOME</h1>
						</a>
					</Link>
				</Col>
				<Col id={styles.Navlink} xs={12} lg={6} xl={4}>
					<Link href='/'>
						<a>
							<button>Home</button>
						</a>
					</Link>
					<Link href='/browse'>
						<a>
							<button>Browse</button>
						</a>
					</Link>
					<Link href='/about'>
						<a>
							<button>About</button>
						</a>
					</Link>
				</Col>
				<Col id={styles.IconLink} xs={12} lg={4} xl={{ offset: 6, span: 1 }}>
					{authenticated ? (
						<>
							{' '}
							<Link href='/library'>
								<a>
									<button>
										<FontAwesomeIcon icon={faBook} />
									</button>
								</a>
							</Link>
							<Link href='/account'>
								<a>
									<button>
										<FontAwesomeIcon icon={faUser} />
									</button>
								</a>
							</Link>
						</>
					) : (
						<Link href='/account/authentication'>
							<a>
								<button>Login</button>
							</a>
						</Link>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default NavBar;
