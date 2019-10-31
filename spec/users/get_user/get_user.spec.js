const api = require('./api');

describe('Users', () => {
	it('urls can contain numbers to create specific calls', async () => {
		const users = await api.getUser(1);
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return {
		'id': 1,
		'name': 'John',
		'lastName': 'Smith'
	}
		;
}
