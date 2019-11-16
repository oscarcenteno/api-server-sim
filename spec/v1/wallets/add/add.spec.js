const api = require('./api');
const wallet = {
	name: 'sample',
};

describe('OpenApi 3 validation', () => {
	it('can validate a valid POST request body', async () => {
		const data = await api.addWallet(wallet);

		expect(data).toEqual({ id: 1 });
	});
});
