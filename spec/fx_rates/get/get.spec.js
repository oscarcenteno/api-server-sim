const api = require('./api');

describe('FX Rates', () => {
	it('can match headers', async () => {
		const rates = await api.getFxRatesGbp();
		const expected = { 'rate': 2.00 };

		expect(rates).toEqual(expected);
	});

	it('headers can be a json file', async () => {
		const rates = await api.getFxRatesEur();
		const expected = { 'rate': 1.12 };

		expect(rates).toEqual(expected);
	});
});
