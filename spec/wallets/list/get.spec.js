const api = require('./api');

describe('Excel', () => {
	it('can have any number of scenarios', async () => {
		const users = await api.getWallets();
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return [{ 'name': 'sample' }, { 'name': 'sample2' }];
}
