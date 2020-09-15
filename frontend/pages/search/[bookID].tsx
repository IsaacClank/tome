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
	return (
		<>
			<Row>
				<Col xl={3}>
					<img src={book.imageLinks.thumbnail} alt='' style={{ width: '12em' }} />
				</Col>
				<Col xl={9}>
					<h2>{book.title}</h2>
					<div>{book.subtitle}</div>
					<div>
						Rating: <span>{book.rating}</span>
					</div>
					<div>
						Language: <span>{book.language}</span>
					</div>
					<div>
						Published Date: <span>{book.publishedDate}</span>
					</div>
					<div>
						Publisher: <span>{book.publisher}</span>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>Description</Col>
				<Col>
					<div dangerouslySetInnerHTML={{ __html: book.description }} />
				</Col>
			</Row>
		</>
	);
};
