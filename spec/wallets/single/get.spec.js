const api = require('./api');

describe('Wallets', () => {
	it('can parse all the tabs in the Excel', async () => {
		const users = await api.getSingleWallet('sample');
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return { 'name': 'sample' };
}
