/* eslint-disable no-console */
let app;
const { default: axios } = require('axios');

let callsContainer = {
    port: 0,
    calls: [],
};

class RecordingProxy {

    constructor({ port, destinationFile, callBackUrl, simRelativeUrl }) {
        this.destinationFile = destinationFile;
        this.port = port;
        this.callBackUrl = callBackUrl;
        this.simRelativeUrl = simRelativeUrl;

        console.log('Received parameters:');
        console.log(`- port: ${port}`);
        console.log(`- destinationFile: ${destinationFile}`);
        console.log(`- callBackUrl: ${callBackUrl}`);
    }

    async run() {
        console.log('Starting proxy server...');

        app = initializeApp();

        configureMiddleware({ callBackUrl: this.callBackUrl });

        callsContainer.port = this.port;
        process.title = `api-server-sim-proxy-recorder-${this.port}`;
        app.listen(this.port, () => console.log(`Sim Server Proxy is recording on port ${this.port}!`));
    }
}

module.exports = RecordingProxy;

function configureMiddleware({ callBackUrl }) {
    const dynamicsMiddleware = async (req, res, next) => {

        if (req.url == '/favicon.ico') {
            next();
        }

        console.log(`Logged  ${req.method} ${req.url}`);

        const call = {
            method: req.method.toLowerCase(),
            url: req.url.toLowerCase(),
            forwardedUrl: callBackUrl + req.url.toLowerCase(),
            headers: req.headers,
            body: req.body,
            query: req.query,
            responseStatus: undefined,
            responseHeaders: undefined,
            responseBody: undefined
        };

        const proxyMethods = {
            get: proxyGet,
            post: proxyPost,
            put: proxyPut,
            delete: proxyDelete
        };

        const proxyMethod = proxyMethods[call.method];
        try {
            const response = await proxyMethod(call);

            call.responseStatus = response.status;
            call.responseHeaders = response.headers;
            call.responseBody = response.data;
        } catch (error) {
            call.responseStatus = error.response.status;
            call.responseHeaders = error.response.headers;
            call.responseBody = error.response.data;
        }

        res.set('Content-Type', 'application/json');
        res.status(call.responseStatus).json(call.responseBody);

        reportCall(call);


    };

    app.get('/hello', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: 'hello world!' });
    });

    app.get('/calls', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(callsContainer);
    });

    // application level middleware
    app.use(dynamicsMiddleware);

}

async function proxyGet({ forwardedUrl, headers }) {
    const options = { headers };
    return await axios.get(forwardedUrl, options);
}

async function proxyPost({ forwardedUrl, headers, body }) {
    const options = { headers };
    return await axios.post(forwardedUrl, body, options);
}

async function proxyPut({ forwardedUrl, headers, body }) {
    const options = { headers };
    return await axios.put(forwardedUrl, body, options);
}

async function proxyDelete({ forwardedUrl, headers, body }) {
    const options = { headers };
    return await axios.delete(forwardedUrl, options);
}

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

function reportCall({ method, url, headers, body, query, responseStatus, responseHeaders, responseBody }) {
    const call = {
        method,
        url,
        headers,
        body,
        query,
        responseStatus,
        responseHeaders,
        responseBody,
        timeStamp: Date.now()
    };
    callsContainer.calls.push(call);
}
