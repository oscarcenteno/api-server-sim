const api = require('../list/api');

describe('OpenApi 3 validator', () => {
	it('can validate swagger on endpoints under the server base url given un swagger file (test_server/v1/openapi.yaml)', async () => {
		const users = await api.getSingleWallet(1);
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return { id: 1, name: 'sample' };
}
