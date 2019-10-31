const { default: axios } = require('axios');

class Api {
	async getUser(id) {
		const response = await axios.get('http://localhost:3001/users/'+ id);

		return response.data;
	}
}

module.exports = new Api();
