function parseJsonFile(relativeFile) {
	try {
		const path = require('path');
		const appDir = path.dirname(require.main.filename);
		const file = path.join(appDir, relativeFile);

		return require(file);
	} catch (error) {
		throw new Error('Please check if this is a valid path, the file exists, or is a valid json object: ' + relativeFile);
	}
}

class Endpoints {
	constructor(rows) {
		this.endPoints = rows.map((element) => {

			// check required
			if (!element.method || !element.url || !element.status || !element.response) {
				throw new Error('method, url, status and response columns are required for every row. Please check scenario "' + element.scenario + '"');
			}

			
			validatePaths(element);
			validateUrl(element);

			let headers;
			if (element.headers) {
				try {
					headers = JSON.parse(element.headers);
				} catch (error) {
					headers = parseJsonFile(element.headers);
				}
			}

			let query;
			if (element.query) {
				try {
					query = JSON.parse(element.query);
				} catch (error) {
					query = parseJsonFile(element.query);
				}
			}

			let body;
			if (element.body) {
				try {
					body = JSON.parse(element.body);
				} catch (error) {
					body = parseJsonFile(element.body);
				}
			}

			let response;
			if (element.response) {
				try {
					response = JSON.parse(element.response);
				} catch (error) {
					response = parseJsonFile(element.response);
				}
			}

			const allowedMethods = ['get', 'post', 'put', 'delete'];
			const currentMethod = element.method.toLowerCase();
			if (allowedMethods.includes(currentMethod)) {
				return {
					method: currentMethod,
					url: element.url,
					jsonHeaders: headers,
					jsonBody: body,
					jsonQuery: query,
					jsonResponse: response,
					status: element.status
				};
			} else {
				throw new Error(`Method ${currentMethod} is not allowed for ${element.url}`);
			}
		});
	}
}

module.exports = Endpoints;
function validateUrl(element) {
	if (!element.url.startsWith('/')) {
		throw new Error(`url ${element.url} must start with a "/"`);
	}

	if (element.url.includes('\\')) {
		throw new Error(`url ${element.url} must not include a "\\"`);
	}
}

function validatePaths(element) {
	if (element.url.includes('\\')) {
		throw new Error(`url ${element.url} must not include a "\\"`);
	}

	if (element.body && element.body.includes('\\')) {
		throw new Error(`body ${element.body} must not include a "\\"`);
	}

	if (element.headers && element.headers.includes('\\')) {
		throw new Error(`headers ${element.headers} must not include a "\\"`);
	}

	if (element.query && element.query.includes('\\')) {
		throw new Error(`query ${element.query} must not include a "\\"`);
	}

	if (element.response && element.response.includes('\\')) {
		throw new Error(`response ${element.response} must not include a "\\"`);
	}
}
