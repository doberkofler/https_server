import forge from 'node-forge';
import {textLoad} from './io.js';

type certificateType = {
	key: string,
	cert: string,
};

export const loadCertificate = (): certificateType => {
	const privateKey = textLoad('certificate.key');
	const certificate = textLoad('certificate.cert');
	
	return {
		key: privateKey,
		cert: certificate
	};
};

export const generateCertificate = (): certificateType => {
	return generateX509Certificate([
		{type: 6, value: 'http://localhost'},
		{type: 7, ip: '127.0.0.1'},
	]);
};

export const generateX509Certificate = (altNames: unknown): certificateType => {
	const issuer = [
		{name: 'commonName', value: 'example.com'},
		{name: 'organizationName', value: 'E Corp'},
		{name: 'organizationalUnitName', value: 'Washington Township Plant'},
	];
	const certificateExtensions = [
		{name: 'basicConstraints', cA: true},
		{name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true},
		{name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true},
		{name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true},
		{name: 'subjectAltName', altNames},
		{name: 'subjectKeyIdentifier'},
	];
	const keys = forge.pki.rsa.generateKeyPair(2048);
	const cert = forge.pki.createCertificate();
	cert.validity.notBefore = new Date();
	cert.validity.notAfter = new Date();
	cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
	cert.publicKey = keys.publicKey;
	cert.setSubject(issuer);
	cert.setIssuer(issuer);
	cert.setExtensions(certificateExtensions);
	cert.sign(keys.privateKey);
	return {
		key: forge.pki.privateKeyToPem(keys.privateKey),
		cert: forge.pki.certificateToPem(cert),
	};
};
