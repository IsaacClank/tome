import { useForm } from 'lib/hooks/UseForm';
import { Container, Row } from 'react-bootstrap';
import styles from './index.module.scss';

const SearchBar = () => {
	const template: Parameters<typeof useForm>[0] = {
		search: {
			name: 'search',
			value: '',
			type: 'text',
			label: 'Start adding books to your library',
			autocomplete: false,
		},
	};

	const [Form, formValues] = useForm(template, () => {
		console.log(formValues);
	});

	return Form;
};

const Index = () => {
	return (
		<Container id={styles.Content}>
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
	);
};

export default Index;
