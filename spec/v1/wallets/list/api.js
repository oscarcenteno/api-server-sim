const { default: axios } = require('axios');

class Api {
	/**
	 * @param {number} id
	 */
	async getSingleWallet(id) {
		const response = await axios.get('http://localhost:3001/v1/wallets/' + id);

		return response.data;
	}
}

module.exports = new Api();
