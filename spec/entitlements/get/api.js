const { default: axios } = require('axios');

class Api {
	async getEntitlements() {
		const url = 'http://localhost:3001/entitlements?role=krm%20operator';
		const response = await axios.get(url);

		return response.data;
	}
}

module.exports = new Api();
