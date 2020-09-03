// JSX imports
import { Container, Row } from 'react-bootstrap';

// Hook & context imports
import { useForm } from 'lib/hooks/useForm';

// Style imports
import styles from './index.module.scss';
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
	const [Form, formValues] = useForm(
		{
			search: {
				name: 'search',
				value: '',
				type: 'text',
				label: 'Start adding books to your library',
				autocomplete: false,
			},
		},
		() => console.log(formValues)
	);

	return Form;
};
