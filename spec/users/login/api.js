const { default: axios } = require('axios');

class Api {
	async getUnauthorizedUserLogin() {
		const response = await axios.get('http://localhost:3001/users/login?username=user.maker&password=1234');

		return response;
	}
}

module.exports = new Api();
