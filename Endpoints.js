function getPath(relativeFile) {
	const path = require('path');
	const appDir = path.dirname(require.main.filename);
	const file = path.join(appDir, relativeFile);

	return require(file);
}

class Endpoints {
	constructor(rows) {
		this.endPoints = rows.map((element) => {
			let query;
			if (element.query) {
				try {
					query = JSON.parse(element.query);
				} catch (error) {
					query = getPath(element.query);
				}
			}

			let body;
			if (element.body) {
				try {
					body = JSON.parse(element.body);
				} catch (error) {
					body = getPath(element.body);
				}
			}

			let response;
			if (element.response) {
				try {
					response = JSON.parse(element.response);
				} catch (error) {
					response = getPath(element.response);
				}
			}

			const allowedMethods = [ 'get', 'post', 'put' ];
			const currentMethod = element.method.toLowerCase();
			if (allowedMethods.includes(currentMethod)) {
				return {
					method: currentMethod,
					url: element.url,
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
