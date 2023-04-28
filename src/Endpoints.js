function parseJsonFile({ appDir, file }) {
    try {
        const path = require('path');
        const absoluteFile = path.join(appDir, file);

        return require(absoluteFile);
    } catch (error) {
        throw new Error('Please check if this is a valid path, the file exists, or is a valid json object: ' + file);
    }
}

class Endpoints {
    constructor({ appDir, rows }) {
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
                    headers = parseJsonFile({ appDir, file: element.headers });
                }
            }

            let query;
            if (element.query) {
                try {
                    query = JSON.parse(element.query);
                } catch (error) {
                    query = parseJsonFile({ appDir, file: element.query });
                }
            }

            let body;
            if (element.body) {
                try {
                    body = JSON.parse(element.body);
                } catch (error) {
                    body = parseJsonFile({ appDir, file: element.body });
                }
            }

            let response;
            if (element.response) {
                try {
                    response = JSON.parse(element.response);
                } catch (error) {
                    response = parseJsonFile({ appDir, file: element.response });
                }
            }

            const allowedMethods = ['get', 'post', 'put', 'delete'];
            const currentMethod = element.method.toLowerCase();
            if (allowedMethods.includes(currentMethod)) {
                return {
                    suite: element.suite,
                    scenario: element.scenario,
                    method: currentMethod,
                    url: element.url,
                    jsonHeaders: headers,
                    jsonBody: body,
                    jsonQuery: query,
                    jsonResponse: response,
                    status: element.status,
                    sampleUrl: element['sample url'],
                    sampleBody: element['sample body']
                };
            } else {
                throw new Error(`Method ${currentMethod} is not allowed for ${element.url}`);
            }
        });
    }

    getList() {
        return this.endPoints;
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
