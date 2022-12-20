import {jsonLoad} from './io.js';
import fs from 'fs';
import {z} from 'zod';

const userObject = z.object({
	username: z.string().nonempty(),
	password: z.string().nonempty(),
}).strict();
export type userType = z.infer<typeof userObject>;
const configObject = z.object({
	port: z.nullable(z.number().gte(1).lte(65536).default(443)),
	generateCentificate: z.nullable(z.boolean().default(false)),
	users: z.array(userObject).nonempty(),
}).strict();
export type configType = z.infer<typeof configObject>;

/**
 * Parse the command line arguments.
 *
 * @returns {string} - The configuration filename.
 */
export const parseArguments = (): string => {
	if (process.argv.length > 3) {
		usage('invalid number of arguments');
	}

	if (process.argv.length === 3) {
		if (!fs.existsSync(process.argv[2])) {
			usage(`configuration file "${process.argv[2]}" does not exist`);
		}

		return process.argv[2];
	}

	return 'config.json';
};

/**
 * Returns a configuration object.
 *
 * @param {string} [filename='config.json'] - The configuration filename.
 * @param {string} [encryptionKey=''] - The encryption key.
 * @returns {configType} - A configuration object.
 */
export const configLoad = (filename = 'config.json', encryptionKey = ''): configType => {
	const result = jsonLoad<unknown>(filename, encryptionKey);

	return configObject.parse(result);
};

/**
 * Show usage message and exist with error if an error message is given.
 *
 * @param {string} [error=''] - The error.
 */
const usage = (error = ''): void => {
	console.log('Usage: node index.js <configfile>');

	if (error.length > 0) {
		console.log(`ERROR: ${error}`);
		process.exit(-1);
	}
};
