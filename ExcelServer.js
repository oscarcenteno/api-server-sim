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
	const _ = require('underscore');

	switch (element.method) {
		case 'get':
			app.get(element.url, (req, res) => {
				res.setHeader('Content-Type', 'application/json');

				const mappings = element.mappings;
				const found = mappings.find((element) => _.isEqual(element.query, req.query));

				if (found) {
					res.status(found.status).json(found.response);
				} else {
					res.status(404).send({ message: 'Query params were not matched.' });
				}
			});
			break;
		case 'post':
			app.post(element.url, (req, res) => {
				res.setHeader('Content-Type', 'application/json');

				const mappings = element.mappings;
				const found = mappings.find((element) => _.isEqual(element.body, req.body));

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
				const found = mappings.find((element) => _.isEqual(element.body, req.body));

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
