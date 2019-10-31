const { default: axios } = require('axios');

class Api {
	async getUsers() {
		const response = await axios.get('http://localhost:3001/users');

		return response.data;
	}
}

module.exports = new Api();
