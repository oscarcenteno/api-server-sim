const { default: axios } = require('axios');

class Api {
	async createSimulation({ method, path, status, response }) {
		const data = { method, path, status, response };
		const url = 'http://localhost:3001/simulations';
		await axios.post(url, data);
	}

	async deleteSimulations() {
		const url = 'http://localhost:3001/simulations';
		await axios.delete(url);
	}
}

module.exports = new Api();
