import React from 'react';
import { SERVER_HOST, LIB_API_QUERY } from 'libs/_config';
import { checkEmptyObject, isPlainObject } from 'libs/_types';
import { useRouter } from 'next/dist/client/router';
import { stringify as parseQueryString } from 'querystring';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import styles from './search.module.scss';
import useSWR from 'swr';

interface QueryData {
	items: {
		id: string;
		selfLink: string;
		title: string;
		subtitle: string;
		authors: string[];
		publishedDate: string;
		rating: number | string;
		cover: string;
		description: string;
	}[];
	page: number;
}

//
// -----------------------------MAIN COMPONENT-----------------------------
//
const fetcher = (url: string) => fetch(url).then(r => r.json());
const Search = () => {
	const query = useRouter().query;

	const { data } = useSWR(() => {
		if (checkEmptyObject(query)) return null;
		else return `${SERVER_HOST}${LIB_API_QUERY}?${parseQueryString(query)}`;
	}, fetcher);

	return (
		<div id={styles.Content}>
			<Container>
				<Row className={styles.row}>
					<Col id={styles.SearchInfo} sm={12}>
						<h1>
							Search results for: <span>{query.q ?? ''}</span>
						</h1>
					</Col>
					<Col id={styles.SearchPagination}>
						<Pagination />
					</Col>
				</Row>
				<Row id={styles.SearchResult}>
					<ResultRenderer data={data?.data || null} />
				</Row>
			</Container>
		</div>
	);
};
export default Search;

// ---------------------------------------CHILD COMPONENTS---------------------------------------

const ResultRenderer = (props: { data: QueryData | null }) => {
	const render = () => {
		return props.data?.items.map(entry => (
			<Row key={entry.id} className={styles.card}>
				<Col sm={2} className={styles.cardImage}>
					<img src={entry.cover} alt='' />
				</Col>
				<Col className={styles.cardBody}>
					<div className={styles.title}>{entry.title}</div>
					<div className={styles.author}>{entry.authors}</div>
					<div className={styles.rating}>{entry.rating || '0.0'}</div>
					<div className={styles.desc}>
						<label>Description:</label>{' '}
						{<TruncatedDescription desc={entry.description} /> ||
							'No description found for this book'}
					</div>
				</Col>
			</Row>
		));
	};

	return <Col>{render()}</Col>;
};

const TruncatedDescription = (props: { desc: string }) => {
	const [description, setDescription] = React.useState(props.desc);
	const [readMore, setReadMore] = React.useState(false);

	const wordCount = description.split(' ').length;

	React.useEffect(() => {
		if (readMore) setDescription(props.desc);
		else if (wordCount > 100)
			setDescription(description.split(' ').slice(0, 100).concat('... ').join(' '));
	}, [description, readMore, props.desc, wordCount]);

	return (
		<p>
			{description}
			{wordCount > 100 && (
				<button onClick={() => setReadMore(!readMore)}>{readMore ? 'Less' : 'More'}</button>
			)}
		</p>
	);
};

const Pagination = () => {
	const Router = useRouter();
	const [page, setPage] = React.useState(parseInt(String(Router.query.page)));
	const updatePage = (event: Event | any) => {
		switch (event.target.name) {
			case 'prev':
				if (page > 1) {
					Router.push({
						pathname: Router.pathname,
						query: { ...Router.query, page: String(page - 1) },
					});
				}
				break;
			case 'next':
				Router.push({
					pathname: Router.pathname,
					query: { ...Router.query, page: String(page + 1) },
				});
				break;
		}
		return;
	};

	React.useEffect(() => {
		if (isPlainObject(Router.query)) setPage(parseInt(String(Router.query.page)));
	}, [Router.query]);

	return (
		<div>
			<button name='prev' onClick={updatePage}>
				Previous
			</button>
			<button name='next' onClick={updatePage}>
				Next
			</button>
		</div>
	);
};
