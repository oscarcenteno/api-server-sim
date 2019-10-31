const { default: axios } = require('axios');

class Api {
	async getBookForUser({ userId, bookId }) {
		const response = await axios.get(`http://localhost:3001/users/${userId}/books/${bookId}`);

		return response.data;
	}
}

module.exports = new Api();
