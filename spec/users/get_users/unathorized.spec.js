const api = require('./api');

describe('Wallets', () => {
	it('can validate unauthorized users', async () => {
		try {
      await api.getUnauthorizedUserLogin();
		} catch (e) {
			expect(e.response.status).toEqual(403);
		}
	});
});
