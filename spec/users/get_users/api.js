var axios = require('axios');

class Api {
	async getUsers() {
		var response = await axios.get('http://localhost:3001/users');

		return response.data;
	}

	async getUnauthorizedUserLogin() {
		var response = await axios.get('http://localhost:3001/user/login?username=user.maker&password=1234');

		return response;
	}
}

module.exports = new Api();
