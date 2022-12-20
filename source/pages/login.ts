import {renderHtmlPage} from '../html.js';

import type {Request, Response} from 'express';

export const pageLogin = (req: Request, res: Response, options?: {message?: string}): void => {
	const body = [];

	if (options && options.message && options.message.length > 0) {
		body.push(`<h4>${options.message}</h4>`);
	}

	body.push('<form action="/login" method="POST">');
	body.push('Username: <input name="username" type="text" required placeholder="Username" />');
	body.push('<br>');
	body.push('Password: <input name="password" type="password" required placeholder="Password" />');
	body.push('<br>');
	body.push('<button type="Submit">Login</button>');
	body.push('<br>');
	body.push('</form>');

	renderHtmlPage(res, body, {title: 'Login'});
};
