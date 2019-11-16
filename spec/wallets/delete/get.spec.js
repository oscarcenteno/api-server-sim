const api = require('./api');

describe('Delete', () => {
	it('can match a DELETE method with query params', async () => {
		const body = await api.deleteSingleWallet(1);

		expect(body).toEqual({
			'message': 'Deleted!'
		});
	});
});
