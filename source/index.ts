import https from 'https';
import {loadCertificate, generateCertificate} from './certificate.js';
import {parseArguments, configLoad} from './config.js';
import {makeExpressApp} from './app.js';

const configFilename = parseArguments();
const config = configLoad(configFilename);
const app = makeExpressApp(config);
const certificate = config.generateCentificate ? generateCertificate() : loadCertificate();

const server = https.createServer(certificate, app);
server.listen(config.port, () => {
	console.log(`Listening on https://localhost:${config.port}/`);
});
