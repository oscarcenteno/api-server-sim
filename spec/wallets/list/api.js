const { default: axios } = require('axios');

class Api {
	async getWallets() {
		const response = await axios.get('http://localhost:3001/wallets');

		return response.data;
	}
}

module.exports = new Api();
