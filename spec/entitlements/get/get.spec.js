const api = require('./api');

describe('Entitlements', () => {
	it('query can be a json file', async () => {
		const users = await api.getEntitlements();
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return [
		'Entitlement1',
		'Entitlement2',
		'Entitlement3',
		'Entitlement4'
	];
}
