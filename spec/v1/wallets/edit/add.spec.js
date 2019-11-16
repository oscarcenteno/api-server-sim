const api = require('./api');
const wallet = {
	id: 1,
	name: 'sample',
};

describe('OpenApi 3 validation', () => {
	it('can validate a valid PUT request body', async () => {
		const data = await api.editWallet({ id: 1, data: wallet });

		expect(data).toEqual({
			id: 1,
			'name': 'sample2'
		}
		);
	});
});
