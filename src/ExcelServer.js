/* eslint-disable no-console */
// app to be initialized
let app;
// const expressOasGenerator = require('express-oas-generator');

let callsContainer = {
	port: 0,
	calls: []
};

class ExcelServer {
	constructor({ file, port }, apiSpec) {
		this.file = file;
		this.port = port;
		this.apiSpec = apiSpec;

		console.log('file: ' + file);
		console.log('port: ' + port);
	}

	run() {
		console.log('Starting server...');

		app = initializeApp();

		installOpenApiValidator(this.apiSpec);

		const getSmartEndPoints = require('./smart_endpoints');
		const smartGetEndPoints = getSmartEndPoints(this.file);
		initializeEndpointsInApp(smartGetEndPoints);

		// calls
		callsContainer.port = this.port;
		configureCallsEndpoints();

		/** place handleRequests as the very last middleware */
		//expressOasGenerator.handleRequests();

		// For Open Api Validator errors
		// 6. Create an Express error handler
		app.use((err, req, res, next) => {
			// 7. Customize errors
			res.status(err.status || 500).json({
				message: err.message,
				errors: err.errors,
			});
		});

		process.title = `api-server-sim-${this.port}`;
		app.listen(this.port, () => console.log(`Listening on port ${this.port}!`));
	}


}

module.exports = ExcelServer;

function installOpenApiValidator(apiSpec) {
	if (apiSpec) {
		const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
		new OpenApiValidator({
			apiSpec: apiSpec,
			validateRequests: true,
			validateResponses: true,
		}).install(app);
	}
}

function configureCallsEndpoints() {
	app.get('/calls', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(callsContainer);
	});

	app.put('/calls/flush', (req, res) => {
		res.setHeader('Content-Type', 'application/json');

		const flushed = callsContainer.calls.length;

		callsContainer.calls = [];
		res.status(200).json({ 'message': `Flushed ${flushed} calls!` });
	});

	app.get('/calls/last', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		const receivedMethod = req.query.method;
		const receivedUrl = req.query.url;
		if (receivedMethod != undefined && receivedUrl != undefined) {
			const method = receivedMethod.toLowerCase();
			const url = receivedUrl.toLowerCase();
			const calls = callsContainer.calls.filter(call => call.method.toLowerCase() === method && call.url.toLowerCase() === url);
			const lastCall = calls[calls.length - 1];
			if (lastCall != undefined) {
				res.status(200).json(lastCall);
			}
			else {
				res.status(404).json({ message: 'No call was found.' });
			}
		}
		else {
			res.status(400).json({ message: `url and method query params are required. Received:  url: ${req.query.url} method: ${req.query.method}` });
		}
	});


}

// app
function initializeApp() {
	const express = require('express');
	const app = express();

	/** place handleResponses as the very first middleware */
	//expressOasGenerator.handleResponses(app, { swaggerUiServePath: 'api-docs', specOutputPath: 'swagger.json', predefinedSpec: {}, writeIntervalMs: 1000 * 10 });

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
				reportCall({ method: 'GET', element, req });
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
				reportCall({ method: 'POST', element, req });
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
				reportCall({ method: 'PUT', element, req });
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
		case 'delete':
			app.delete(element.url, (req, res) => {
				reportCall({ method: 'DELETE', element, req });
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
		default:
			throw new Error(`Method "${element.method}" is not allowed in api-server-sim. Please submit an issue if required.`);
	}
}

function reportCall({ method, element, req }) {
	const thisCall = {
		'method': method,
		'url': element.url,
		'headers': req.headers,
		'body': req.body,
		'query': req.query,
		'timeStamp': Date.now()
	};
	callsContainer.calls.push(thisCall);
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
		requiredKeys.forEach(key => {
			areContained = areContained && (lowerRequiredHeaders[key] == lowerRequestHeaders[key]);
		});

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
