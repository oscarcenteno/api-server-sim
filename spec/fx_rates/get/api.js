const { default: axios } = require('axios');

class Api {
	async getFxRatesEur() {
		const url = 'http://localhost:3001/fx_rates/eur/usd';
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token _JzeGOOrwXmCX7EPIMeqo6dO35bcbqEU5u4Xpi2TEC0zYsS6Oze7u8Ue-emaSmRB8OfJ87qL-t7C0wLIz-wiyLe8mWmisFwwEmmslNXqixsQESxtyZi1GBDhAOTy83NoXl8edmxqXoRtx_fzKtatZcckSqmcznosZuZ-FXzyOhrLg2hKgfqSacS5qf2_uPnhXmRdafggzvGjpXAOxAtaFyvcY6cl6iclXsa5fBu6FdZK91l7nFKGMmAavhrkOt_Yxh3XGGimHtu0fMzk0Ccphlnep85DOT8yWstrhUEnBQ6E'
			}
		};
		const response = await axios.get(url, config);

		return response.data;
	}

	async getFxRatesGbp() {
		const url = 'http://localhost:3001/fx_rates/eur/gbp';
		const config = {
			headers: { 'Authorization': 'Token _qwwersadfasdfasdf' }
		};
		const response = await axios.get(url, config);

		return response.data;
	}
}

module.exports = new Api();