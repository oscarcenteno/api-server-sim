const { default: axios } = require('axios');

class Api {
	async getFxRatesEur() {
		const url = 'http://localhost:3001/fx_rates/eur/usd';
		const config = {
			headers: require('./headers.json')
		};
		const response = await axios.get(url, config);

		return response.data;
	}

	async getFxRatesGbp() {
		const url = 'http://localhost:3001/fx_rates/eur/gbp';
		const config = {
			headers: { 'Authorization': 'Token TheToken' }
		};
		const response = await axios.get(url, config);

		return response.data;
	}
}

module.exports = new Api();
