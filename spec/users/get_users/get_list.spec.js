const api = require('./api');

describe('Users', () => {
	it('can get the users list', async () => {
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
