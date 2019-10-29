var axios = require('axios');

class Api {
	async editUser(user) {
		var response = await axios.put('http://localhost:3001/users/' + user.id, user);

		return response.data;
	}
}

module.exports = new Api();
