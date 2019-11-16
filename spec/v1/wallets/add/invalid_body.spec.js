const api = require('./api');
const wallet = {
	name2: 'sample',
};

describe('OpenApi 3 validation', () => {
	it('can validate an invalid POST request body', async () => {
		try {
			await api.addWallet(wallet);
			fail('should validate an invalid POST request body');
		} catch (error) {
			// invalid request body
			expect(error.response.status).toEqual(400);
		}
	});
});
