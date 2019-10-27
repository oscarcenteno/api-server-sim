var axios = require('axios');

class Api {
	async getUsers() {
		var response = await axios.get('http://localhost:3000/users');

		return response.data;
	}

	async getUnauthorizedUserLogin() {
		var response = await axios.get('http://localhost:3000/user/login?username=user.maker&password=1234');

		return response;
	}
}

module.exports = new Api();
