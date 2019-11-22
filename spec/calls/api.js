const { default: axios } = require('axios');

class Api {
	async getPortFromTheCalls() {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.get(apiUrl);
		const body = response.data;

		return body.port;
	}

	async getCalls() {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.get(apiUrl);

		return response.data.calls;
	}

	async getCallsTo({ method, url }) {
		const apiUrl = `http://localhost:3001/calls?method=${method}&url=${url}`;
		const response = await axios.get(apiUrl);

		return response.data;
	}

	async getCallsWithMethod(method) {
		const apiUrl = `http://localhost:3001/calls?method=${method}`;
		const response = await axios.get(apiUrl);

		return response.data;
	}

	async getCallsForUrl(url) {
		const apiUrl = `http://localhost:3001/calls?url=${url}`;
		const response = await axios.get(apiUrl);

		return response.data;
	}

	async getLastCallTo({ method, url }) {
		const apiUrl = `http://localhost:3001/calls/last/?method=${method}&url=${url}`;
		const response = await axios.get(apiUrl);
		const call = response.data;

		return {
			method: call.method,
			url: call.url,
			headersIsReported: call.headers != undefined,
			bodyIsReported: call.body != undefined,
			queryIsReported: call.query != undefined
		};
	}

	async deleteCalls() {
		const apiUrl = 'http://localhost:3001/calls';
		const response = await axios.delete(apiUrl);
		return response.data;
	}
}

module.exports = new Api();
