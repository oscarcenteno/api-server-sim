const { default: axios } = require('axios');

class Api {
	async getGetHello() {
		const url = 'http://localhost:3001/hello';
		const response = await axios.get(url);

		return response.data;
	}
}

module.exports = new Api();
