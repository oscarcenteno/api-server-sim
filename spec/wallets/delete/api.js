const { default: axios } = require('axios');

class Api {
	/**
	 * @param {number} id
	 */
	async deleteSingleWallet(id) {
		const response = await axios.delete('http://localhost:3001/wallets?id=' + id);

		return response.data;
	}
}

module.exports = new Api();
