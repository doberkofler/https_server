import {renderHtmlPage} from '../html.js';

import type {Request, Response} from 'express';

export const pageHome = (req: Request, res: Response): void => {
	renderHtmlPage(res, `<h1>Welcome ${req.session.username}</h1>`, {title: 'Home'});
};
