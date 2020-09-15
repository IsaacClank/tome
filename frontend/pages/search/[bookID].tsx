import Loading from 'components/Loading';
import useFetcher from 'libs/hooks/useFetcher';
import useLoader from 'libs/hooks/useLoader';
import { SERVER_HOST } from 'libs/_config';
import { isPlainObject } from 'libs/_types';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import useSWR from 'swr';
import styles from './[bookID].module.scss';

const Book = () => {
	const Router = useRouter();
	const { data } = useSWR(
		Router.query.bookID ? `${SERVER_HOST}/lib/detail/${Router.query.bookID}` : null,
		useFetcher({ errorHandler: errorHandler })
	);

	const render = useLoader(isPlainObject(data), {
		load: () => <Loading />,
		alt: () => <Loading />,
		dest: () => <BookDetailRenderer {...data} />,
	});

	return (
		<div id={styles.Content}>
			<Container>{render}</Container>
		</div>
	);
};

export default Book;

// ----------------------------------------------TYPE----------------------------------------------
//

interface BookDetail {
	description: string;
	imageLinks: {
		smallThumbnail: string;
		thumbnail: string;
	};
	industryID: { type: string; identifier: string }[];
	infoLink: string;
	language: string;
	maturityRating: string;
	previewLink: string;
	publishedDate: string;
	publisher: string;
	rating: string;
	title: string;
	subtitle: string;
}

// ----------------------------------------------UTILS----------------------------------------------
//

const errorHandler = (data: any) => {
	if (data.error) {
		const error = new Error('Fetch Error');
		error.message = data.error.message || data.error;
		throw error;
	}
	if (data.data) return data.data;
};

const BookDetailRenderer = (book: BookDetail): JSX.Element => {
	console.clear();
	console.log(book);
	return (
		<>
			<Row>
				<Col xl={3}>
					<img src={book.imageLinks.thumbnail} alt='' className={styles.cover} />
				</Col>
				<Col xl={9}>
					<h1 className={styles.title}>{book.title}</h1>
					<div className={styles.subtitle}>{book.subtitle}</div>
					<div className={styles.rating}>
						<label>Rating:</label>
						<span>{book.rating}</span>
					</div>
					<div className={styles.language}>
						<label>Language:</label>
						<span>{book.language}</span>
					</div>
					<div className={styles.publishedDate}>
						<label>Published Dated:</label>
						<span>{book.publishedDate}</span>
					</div>
					<div className={styles.publisher}>
						<label>Publisher:</label>
						<span>{book.publisher}</span>
					</div>
					<div className={styles.isbn}>
						<label>ISBN:</label>
						<span>{book.industryID[0].identifier}</span>
					</div>
					<div className={styles.preview}>
						<a href={book.previewLink} target='blank'>
							<button>Preview</button>
						</a>
					</div>
				</Col>
			</Row>
			<Row className={styles.description}>
				{/* <Col xs={12}> */}
				<label>Description</label>
				<p dangerouslySetInnerHTML={{ __html: book.description }} />
				{/* </Col> */}
			</Row>
		</>
	);
};
