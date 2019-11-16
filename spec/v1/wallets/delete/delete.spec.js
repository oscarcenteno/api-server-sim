const api = require('./api');

describe('OpenApi 3 validation', () => {
	it('can validate non documented methods', async () => {
		try {
			await api.deleteSingleWallet(1);
			fail('should validate delete method is not documented');
		} catch (error) {
			// method not allowed
			expect(error.response.status).toEqual(405);
		}
	});
});
