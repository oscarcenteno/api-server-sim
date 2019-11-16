const api = require('./api');
const wallet = {
	name: 'sample',
};

describe('OpenApi 3 validation', () => {
	it('can validate an invalid PUT request body', async () => {
		try {
			await api.editWallet({ id: 1, data: wallet });
			fail('should validate an invalid PUT request body');
		} catch (error) {
			// invalid request body
			expect(error.response.status).toEqual(400);
		}
	});
});
