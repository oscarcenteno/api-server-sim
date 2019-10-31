const api = require('./api');

describe('Users / Books', () => {
	it('can return error codes', async () => {
		try {
			await api.getBookForUser({ userId: 1, bookId: 2 });
		} catch (error) {
			expect(error.response.status).toEqual(404);
		}
	});
});

