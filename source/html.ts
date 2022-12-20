import type {Response} from 'express';

type optionsType = {
	title?: string,
};

export const renderHtmlPage = (res: Response, body: string | string[], options: optionsType): void => {
	const title = typeof options.title === 'string' && options.title.length > 0 ? `<title>${options.title}</title>` : '';

	if (Array.isArray(body)) {
		body = body.join('');
	}

	res.setHeader('Content-Type', 'text/html');
	res.write(`<!DOCTYPE html><html><head>${title}<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0"></head><body>${body}</body></html>`);
	res.end();
};
