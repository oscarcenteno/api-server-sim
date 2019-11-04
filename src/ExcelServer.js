/* eslint-disable no-console */
// app to be initialized
let app;

class ExcelServer {
	constructor({ file, port }) {
		this.file = file;
		this.port = port;

		console.log('file: ' + file);
		console.log('port: ' + port);
	}

	run() {
		console.log('Starting server...');

		app = initializeApp();
		const getSmartEndPoints = require('./smart_endpoints');
		const smartGetEndPoints = getSmartEndPoints(this.file);
		initializeEndpointsInApp(smartGetEndPoints);

		app.listen(this.port, () => console.log(`Listening on port ${this.port}!`));
	}
}

module.exports = ExcelServer;

// app

function initializeApp() {
	const express = require('express');
	const app = express();
	// 	disable cache and 304 Not Modified Response Codes
	app.disable('etag');
	// to be able to parse the body of a request
	// and support application/json or application/x-amz-json-1.1
	app.use(express.json({ type: '*/*' }));
	return app;
}

function initializeEndpointsInApp(smartGetEndPoints) {
	smartGetEndPoints.forEach(createEndpoint);
}

function createEndpoint(element) {


	switch (element.method) {
		case 'get':
			app.get(element.url, (req, res) => {
				res.setHeader('Content-Type', 'application/json');

				const mappings = element.mappings;
				const found = mappings.find((mapping) => matches(mapping.query, req.query) && requiredHeadersAreContained(mapping.headers, req.headers));

				if (found) {
					res.status(found.status).json(found.response);
				} else {
					res.status(404).send({ message: 'Query params were not matched or required Headers were not contained in the Request.' });
				}
			});
			break;
		case 'post':
			app.post(element.url, (req, res) => {
				res.setHeader('Content-Type', 'application/json');

				const mappings = element.mappings;
				const found = mappings.find((mapping) => matches(mapping.body, req.body) && requiredHeadersAreContained(mapping.headers, req.headers));

				if (found) {
					res.status(found.status).json(found.response);
				} else {
					res.status(404).send({ message: 'Body was not matched.' });
				}
			});
			break;

		case 'put':
			app.put(element.url, (req, res) => {
				res.setHeader('Content-Type', 'application/json');

				const mappings = element.mappings;
				const found = mappings.find((mapping) => matches(mapping.body, req.body) && requiredHeadersAreContained(mapping.headers, req.headers));

				if (found) {
					res.status(found.status).json(found.response);
				} else {
					res.status(404).send({ message: 'Body was not matched.' });
				}
			});
			break;
		default:
			break;
	}
}

function matches(requiredProperties, requestProperties) {
	if (requiredProperties) {
		const _ = require('underscore');
		return _.isEqual(requiredProperties, requestProperties);
	}
	else {
		return true;
	}
}

function requiredHeadersAreContained(requiredHeaders, requestHeaders) {
	if (requiredHeaders) {

		const lowerRequiredHeaders = lowercaseAllPropertyNames(requiredHeaders);
		const lowerRequestHeaders = lowercaseAllPropertyNames(requestHeaders);

		const requiredKeys = Object.keys(lowerRequiredHeaders);

		let areContained = true;
		requiredKeys.forEach(key => { areContained = areContained && (lowerRequiredHeaders[key] == lowerRequestHeaders[key]) });

		return areContained;
	}
	else {
		return true;
	}
}

function lowercaseAllPropertyNames(obj) {
	let key, keys = Object.keys(obj);
	let n = keys.length;
	const lowerRequiredHeaders = {};
	while (n--) {
		key = keys[n];
		lowerRequiredHeaders[key.toLowerCase()] = obj[key];
	}
	return lowerRequiredHeaders;
}