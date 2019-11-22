const { default: axios } = require('axios');

class Api {
	async getHello() {
		const url = 'http://localhost:3001/hello';
		const response = await axios.get(url);

		return response.data;
	}

	async postHello() {
		const url = 'http://localhost:3001/hello';
		const response = await axios.post(url, {});

		return response.data;
	}

	async putHello() {
		const url = 'http://localhost:3001/hello';
		const response = await axios.put(url, {});

		return response.data;
	}

	async deleteHello() {
		const url = 'http://localhost:3001/hello';
		const response = await axios.delete(url);

		return response.data;
	}
}

module.exports = new Api();
