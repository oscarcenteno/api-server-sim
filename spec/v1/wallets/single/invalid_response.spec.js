const api = require('./api');

describe('OpenApi 3 validator', () => {
	it('can validate an invalid response', async () => {
		try {
			await api.getSingleWallet('2');
			fail('should validate an invalid response');
		} catch (error) {
			expect(error.response.status).toEqual(500);
		}
	});
});
