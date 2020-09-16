// Functionality
import React from 'react';
import { isEmptyObject, isPlainObject } from 'libs/_types';
import { useRouter } from 'next/dist/client/router';
import { stringify as parseQueryString } from 'querystring';
import useSWR from 'swr';
import useLoader from 'libs/hooks/useLoader';
import useFetcher from 'libs/hooks/useFetcher';
// Config
import { SERVER_HOST, LIB_API_QUERY } from 'libs/_config';
// JSX
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Loading from 'components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
// Style
import styles from './index.module.scss';

// Query response data interface
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

// -----------------------------MAIN COMPONENT-----------------------------
//
// Perform data fetching and render response data
const Search = () => {
	const query = useRouter().query; // get query object from route
	const { fetcher } = useFetcher();
	// perform fetch when after query object is loaded
	const { data } = useSWR(
		() =>
			isEmptyObject(query) ? null : `${SERVER_HOST}${LIB_API_QUERY}?${parseQueryString(query)}`,
		fetcher
	);

	// Loader logic. Render component when data is full fetched
	const renderedComponent = useLoader(
		data ? !isEmptyObject(data?.data) && data.data.items.length > 0 : null,
		{
			load: () => <Loading />,
			dest: () => <ResultRenderer data={data?.data} />, // data is found
			alt: () => <div>NO RESULTS</div>, // no data
		}
	);

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
				<Row id={styles.SearchResult}>{renderedComponent}</Row>
			</Container>
			<ScrollToTopArrow />
		</div>
	);
};
export default Search;

// ---------------------------------------CHILD COMPONENTS---------------------------------------

const ResultRenderer = (props: { data: QueryData | null }) => {
	if (!props.data) return null;
	return (
		<Col>
			{
				// Map array of item into jsx components
				props.data?.items.map(entry => (
					<Row key={entry.id} className={styles.card}>
						<Col sm={2} className={styles.cardImage}>
							<img src={entry.cover} alt='' />
						</Col>
						<Col className={styles.cardBody}>
							<div className={styles.title}>
								<Link href={`/search/[bookID]`} as={`/search/${entry.id}`}>
									<a>{entry.title}</a>
								</Link>
							</div>
							<div className={styles.author}>{entry.authors}</div>
							<div className={styles.rating}>{entry.rating || '0.0'}</div>
							<div className={styles.desc}>
								<label>Description:</label>{' '}
								{<TruncatedDescription desc={entry.description} /> ||
									'No description found for this book'}
							</div>
						</Col>
					</Row>
				))
			}
		</Col>
	);
};

// Truncate each book description if length exceed 100 word.
const TruncatedDescription = (props: { desc: string }) => {
	const [wordCount] = React.useState(props.desc.split(' ').length); // calculate original word count
	const [description, setDescription] = React.useState(props.desc); // current description render
	const [readMore, setReadMore] = React.useState(false); // current render mode. 2 modes: read more & read less

	// Callback to modify description
	const modifyDescription = React.useCallback(
		(type: 'reset' | 'truncate') => {
			// if in 'read more' mode, restore the original description
			// else truncate the description if wordCount > 100
			switch (type) {
				case 'reset':
					return setDescription(props.desc);
				case 'truncate':
					if (wordCount > 100)
						return setDescription(desc => desc.split(' ').slice(0, 100).concat('... ').join(' '));
				default:
					return;
			}
		},
		[props.desc, wordCount]
	);

	// update render when render mode change
	React.useEffect(() => {
		readMore ? modifyDescription('reset') : modifyDescription('truncate');
	}, [readMore, modifyDescription]);

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
	const Router = useRouter(); // router object
	const [page, setPage] = React.useState(parseInt(String(Router.query.page))); // current page

	// Callback to update route
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

	// update page when route change
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

const ScrollToTopArrow = () => {
	const [show, setShow] = React.useState(false); // visible state

	// callback to change scroll position
	const scrollToTop = () => {
		document.getElementById(styles.Content)?.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// add event listener after document is loaded
	if (typeof document !== 'undefined') {
		const content = document.getElementById(styles.Content);
		content?.addEventListener('scroll', () => {
			const posY = content.scrollTop;
			if (posY > 400 && !show) setShow(true);
			if (posY <= 400 && show) setShow(false);
		});
	}

	return (
		<FontAwesomeIcon
			id={styles.Scroller}
			icon={faArrowCircleUp}
			onClick={scrollToTop}
			style={{ display: show ? 'block' : 'none' }}
		/>
	);
};
