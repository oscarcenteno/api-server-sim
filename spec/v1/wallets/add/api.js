const { default: axios } = require('axios');

class Api {
	async addWallet(data) {
		const response = await axios.post('http://localhost:3001/v1/wallets', data);

		return response.data;
	}

}

module.exports = new Api();
