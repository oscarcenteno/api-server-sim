const { default: axios } = require('axios');

class Api {
	async getPortFromTheCalls() {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.get(apiUrl);
		const body = response.data;
		return body.port;
	}

	async getCallsTo(url) {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.get(apiUrl);
		const body = response.data;
		return body.calls.filter(call => call.url === url);
	}

	async getFirstCallTo(url) {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.get(apiUrl);
		const body = response.data;
		const call = body.calls.filter(call => call.url === url)[0];

		return {
			method: call.method,
			url: call.url,
			headersIsReported: call.headers != undefined,
			bodyIsReported: call.body != undefined,
			queryIsReported: call.query != undefined
		};
	}
}

module.exports = new Api();
