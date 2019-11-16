const { default: axios } = require('axios');

class Api {
	async editWallet({ id, data }) {
		const response = await axios.put('http://localhost:3001/v1/wallets/' + id, data);

		return response.data;
	}

}

module.exports = new Api();
