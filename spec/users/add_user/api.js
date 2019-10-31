var axios = require('axios');

class Api {
	async addUser(data) {
		const response = await axios.post('http://localhost:3001/users', data);

		return response.data;
	}

}

module.exports = new Api();
