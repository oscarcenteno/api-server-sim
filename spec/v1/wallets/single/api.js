const { default: axios } = require('axios');

class Api {
	/**
	 * @param {string} name
	 */
	async getSingleWallet(name) {
		const response = await axios.get('http://localhost:3001/v1/wallets/' + name);

		return response.data;
	}
}

module.exports = new Api();
