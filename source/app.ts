import createDebug from 'debug';

import express from 'express';
import bodyParser from 'body-parser';
/*
import multer from 'multer';
*/
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';

//import {renderHtmlPage} from './html.js';
import {pageHome} from './pages/home.js';
import {pageLogin} from './pages/login.js';

import type {configType} from './config.js';

declare module 'express-session' {
	interface SessionData {
		username: string;
	}
}

const debug = createDebug('https_server:app');

export const makeExpressApp = (config: configType) => {
	debug('makeExpressApp');

	const app = express();

	// compression
	app.use(compression());

	// body parser
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true})); 

	// cookie parser
	app.use(cookieParser());

	// session
	app.use(session({
		secret: 'Your secret key',
		resave: false,
		saveUninitialized: false,
		cookie: {
			//secure: true,
		},
	}));

	// multer
	/*
	const upload = multer({dest: './uploads'}); 
	app.use(upload.array());
	*/

	// home
	app.get('/', isSignedIn, (req, res) => {
		pageHome(req, res);
	});

	// login
	app.get('/login', (req, res) => {
		debug('/login');
		pageLogin(req, res);
	});
	app.post('/login', (req, res) => {
		const user = config.users.find(e => e.username === req.body.username && e.password === req.body.password);
		if (user) {
			req.session.username = user.username;
			debug(`User "${req.session.username}" logged in`);
			res.redirect('/');
		} else {
			pageLogin(req, res, {message: 'Invalid credentials!'});
		}
	});

	// logout
	app.get('/logout', (req, res) => {
		if (req.session.username) {
			req.session.destroy(() => {
				debug(`User "${req.session.username}" logged out`);
			});
		}
		res.redirect('/login');
	});

	return app;
};

const isSignedIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	debug(`isSignedIn: req.session.username="${req.session.username}"`);

	if (typeof req.session.username === 'string' && req.session.username.length > 0) {
		next(); // if session exists, proceed to page
	} else {
		res.redirect('/login'); // else redirect to login page
	}
};
