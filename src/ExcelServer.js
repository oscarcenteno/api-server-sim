/* eslint-disable no-console */
// app to be initialized
let app;

let callsContainer = {
    port: 0,
    calls: [],
    recording: false
};

let dynamics = [];

let smtpEmails = [];

class ExcelServer {

    constructor({ files, port }, { apiSpec, validateRequests, validateResponses }) {
        this.files = files;
        this.port = port;
        this.validations = {
            validateOpenApi: validateRequests || validateResponses,
            apiSpec, validateRequests, validateResponses
        };

        console.log('files: ' + files);
        console.log('port: ' + port);
    }

    run() {
        console.log('Starting server...');

        app = initializeApp();

        installOpenApiValidator(this.validations).then(() => {

            configureDynamicsMiddleware();

            const getSmartEndPoints = require('./smart_endpoints');
            const smartGetEndPoints = getSmartEndPoints(this.files);
            initializeEndpointsInApp(smartGetEndPoints);

            // calls
            callsContainer.port = this.port;

            configureCallsEndpoints();

            // smtp server
            configureSmtpMailsEndpoints();
            initializeSmtpServer();

            // Configure error handler for api spec validator
            if (this.validations.validateOpenApi) {
                app.use((err, req, res, next) => {
                    // format error
                    res.status(err.status || 500).json({
                        message: err.message,
                        errors: err.errors,
                    });
                });
            }

            process.title = `api-server-sim-${this.port}`;
            app.listen(this.port, () => console.log(`Sim Server is listening on port ${this.port}!`));
        });
    }
}

module.exports = ExcelServer;

function configureDynamicsMiddleware() {
    const dynamicsMiddleware = (req, res, next) => {
        console.log(`Logged  ${req.method} ${req.url}`);

        const found = dynamics.find(dynamic => dynamic.path === req.path && dynamic.method.toLowerCase() === req.method.toLowerCase());

        if (found) {
            console.log(`  Simulating a dynamic call to ${found.method} ${found.path} with status ${found.status}`);

            // use dynamics just one time
            dynamics = dynamics.filter(dynamic => !(dynamic.path === req.path && dynamic.method.toLowerCase() === req.method.toLowerCase()));
            res.setHeader('Content-Type', 'application/json');
            res.status(found.status).json(found.response);
        } else {
            next();
        }
    };

    // application level middleware
    app.use(dynamicsMiddleware);

    app.get('/simulations', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dynamics);
    });

    app.post('/simulations', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        dynamics.push(req.body);
        const current = dynamics.length;

        res.status(200).json({ 'message': `Created a new simulation. Currently there are ${current} dynamic simulations.` });
    });

    app.delete('/simulations', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const deleted = dynamics.length;

        dynamics = [];
        res.status(200).json({ 'message': `Deleted ${deleted} simulations!` });
    });
}

function initializeSmtpServer() {
    const MailDev = require('maildev');
    const maildev = new MailDev();

    maildev.listen();
    maildev.on('new', function (email) {
        // We got a new email!
        smtpEmails.push(email);
    });
}

function configureSmtpMailsEndpoints() {
    app.get('/emails', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(smtpEmails);
    });

    app.delete('/emails', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const deleted = smtpEmails.length;
        smtpEmails = [];
        let message = '';
        switch (deleted) {
            case 0:
                message = 'No emails to delete!';
                break;
            case 1:
                message = 'Deleted one email!';
                break;
            default:
                message = `Deleted ${deleted} emails!`;
                break;
        }

        res.status(200).json({ 'message': message });
    });

}

async function installOpenApiValidator({ validateOpenApi, apiSpec, validateRequests, validateResponses }) {
    if (validateOpenApi) {
        const OpenApiValidator = require('express-openapi-validator');

        app.use(
            OpenApiValidator.middleware({
                apiSpec,
                validateRequests, // (default)
                validateResponses, // false by default
            }),
        );

        console.log(`Installed OpenApiValidator for ${apiSpec}.`);
    }
}

function configureCallsEndpoints() {
    app.get('/calls', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        callsContainer.recording = false;

        const receivedMethod = req.query.method;
        const receivedUrl = req.query.url;
        if (receivedMethod != undefined && receivedUrl != undefined) {
            const method = receivedMethod.toLowerCase();
            const url = receivedUrl.toLowerCase();
            const calls = callsContainer.calls.filter(call => call.method.toLowerCase() === method && call.url.toLowerCase() === url);
            res.status(200).json(calls);
        }
        else {
            if (receivedMethod != undefined) {
                const method = receivedMethod.toLowerCase();
                const calls = callsContainer.calls.filter(call => call.method.toLowerCase() === method);
                res.status(200).json(calls);
            }
            else {
                if (receivedUrl != undefined) {
                    const url = receivedUrl.toLowerCase();
                    const calls = callsContainer.calls.filter(call => call.url.toLowerCase() === url);
                    res.status(200).json(calls);
                }
                else {
                    res.status(200).json(callsContainer);
                }
            }
        }
    });

    app.post('/calls', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        callsContainer.recording = true;
        const current = callsContainer.calls.length;

        res.status(200).json({ 'message': `Recording started! Currently there are ${current} calls.` });
    });

    app.delete('/calls', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        callsContainer.recording = false;
        const deleted = callsContainer.calls.length;

        callsContainer.calls = [];
        res.status(200).json({ 'message': `Deleted ${deleted} calls! Recording stopped.` });
    });

    app.get('/calls/last', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        callsContainer.recording = false;

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
                res.status(404).json({ message: 'No call was found. Calls recording was stopped.' });
            }
        }
        else {
            res.status(400).json({ message: `url and method query params are required. Received: url: ${req.query.url} method: ${req.query.method}.  Calls recording was stopped.` });
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
    if (callsContainer.recording) {
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
