const { default: axios } = require('axios');

class Api {
	async getSimulations() {
		const url = 'http://localhost:3001/simulations';
		return await axios.get(url);
	}

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
