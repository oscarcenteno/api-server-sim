const api = require('./api');

describe('Query', () => {
	it('can match query', async () => {
		try {
			await api.getUnauthorizedUserLogin();
		} catch (e) {
			expect(e.response.status).toEqual(403);
		}
	});
});
