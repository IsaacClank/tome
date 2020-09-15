import fetch from 'node-fetch';
import { GB_API } from '../_config';
import { ServerResponse } from '../_types';

// -----------------------------------TYPES-----------------------------------
//
type QueryObject = {
	q: string;
	page: number;
	maxResults: number;
	title?: string;
	author?: string;
};

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

// -----------------------------------SERVICES-----------------------------------
//
export const searchBook = async (queryObj: QueryObject) => {
	if (!(queryObj.q || queryObj.author || queryObj.title) || !queryObj.maxResults || !queryObj.page)
		return Promise.reject(new ServerResponse(400, { error: 'MISSING QUERY CONDITION' }));

	return fetch(constructFetchURl(queryObj))
		.then(res => res.json())
		.then(data => {
			if (data.error) return Promise.reject(new ServerResponse(500, { error: data.error }));
			return parseQueryResponse(data, queryObj);
		});
};

export const getBookDetail = async (id: string) => {
	if (!id) return Promise.reject(new ServerResponse(400, { error: 'NO BOOK ID PROVIDED' }));
	console.log(`${GB_API}/${id}`);
	return fetch(`${GB_API}/${id}`)
		.then(r => r.json())
		.then(data => {
			if (data.error) return Promise.reject(new ServerResponse(500, { error: data.error }));
			return data?.volumeInfo;
		});
};

// -----------------------------UTILS-----------------------------
//
const parseQueryResponse = async (data: any, queryObject: QueryObject): Promise<QueryData> => {
	return {
		page: queryObject.page,
		items:
			data?.items?.map((item: any) => ({
				id: item.id || '',
				selfLink: item.selfLink || '',
				title: item.volumeInfo.title,
				subtitle: item.volumeInfo.subtitle || '',
				authors: item.volumeInfo.authors || [''],
				publishedDate: item.volumeInfo.publishedDate || '',
				rating: item.volumeInfo.averageRating || '',
				cover: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
				description: item.volumeInfo.description || '',
			})) || [],
	};
};

const constructFetchURl = (queryObj: QueryObject) => {
	const q = queryObj.q ? queryObj.q : '';
	const inTitle = queryObj.title ? `+intitle:${queryObj.title}` : '';
	const inAuthor = queryObj.author ? `+inauthor:${queryObj.author}` : '';
	const maxResults = `&maxResults=${queryObj.maxResults}`;
	const startIndex = `&startIndex=${(queryObj.page - 1) * queryObj.maxResults}`;
	return `${GB_API}?q=${q}${inAuthor}${inTitle}${maxResults}${startIndex}`;
};
