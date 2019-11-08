const api = require('./api');

describe('Response', () => {
	it('response can be a json file', async () => {
		const users = await api.getUsers();
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return [
		{
			id: 1,
			name: 'John',
			lastName: 'Smith'
		},
		{
			id: 2,
			name: 'Jane',
			lastName: 'Smith'
		}
	];
}
