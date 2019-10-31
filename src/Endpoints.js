function parseJsonFile(relativeFile) {
	try {
		const path = require('path');
		const appDir = path.dirname(require.main.filename);
		const file = path.join(appDir, relativeFile);

		return require(file);
	} catch (error) {
		throw new Error('Please check if this is a valid path or json object: ' + relativeFile);
	}
}

class Endpoints {
	constructor(rows) {
		this.endPoints = rows.map((element) => {

			// check required
			if (!element.method || !element.url || !element.status || !element.response) {
				throw new Error('method, url, status and response columns are required for every row. Please check scenario "' + element.scenario + '"');
			}

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

			const allowedMethods = ['get', 'post', 'put'];
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
				console.log(`Method ${currentMethod} is not allowed for ${element.url}`);
			}
		});
	}
}

module.exports = Endpoints;
