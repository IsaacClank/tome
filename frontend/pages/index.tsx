// JSX imports
import { Container, Row } from 'react-bootstrap';
//
// Hook & context imports
import { useForm } from 'libs/hooks/useForm';
//
// Style imports
import styles from './index.module.scss';
import { useRouter } from 'next/dist/client/router';
import { PlainObject } from 'libs/_types';
//
// -----------------------------MAIN COMPONENT-----------------------------
//
// Route: home page
const Index = () => {
	// Render a search bar
	return (
		<div id={styles.Content}>
			<Container>
				<Row className={styles.title}>
					<h1>TOME</h1>
				</Row>
				<Row className={styles.subtitle}>
					<p>Your Personal Library</p>
				</Row>
				<Row className={styles.searchBar}>
					<SearchBar />
				</Row>
			</Container>
		</div>
	);
};

export default Index;

// -----------------------------CHILD COMPONENTS-----------------------------
//
// Search bar
const SearchBar = () => {
	// Construct search form
	const Router = useRouter();

	const submitHandler = (formValues?: PlainObject) => {
		Router.push({
			query: {
				...formValues,
				maxResults: 10,
				page: 1,
			},
			pathname: '/search',
		});
	};

	const [Form] = useForm(
		{
			search: {
				name: 'q',
				value: '',
				type: 'text',
				label: 'Start adding books to your library',
				autocomplete: false,
			},
		},
		submitHandler
	);

	return Form;
};
