import { useRouter } from 'next/dist/client/router';
import styles from './[bookID].module.scss';

const Book = () => {
	const Router = useRouter();
	return <div id={styles.Content}>{Router.query.bookID}</div>;
};

export default Book;
