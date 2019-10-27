const api = require('./api');
const user = {
	id: 1,
	name: 'John',
	lastName: 'New Last Name'
};

const expected = {
	id: 1,
	name: 'John',
	lastName: 'New Last Name'
};

describe('Users', () => {
	it('can edit a user', async () => {
		const data = await api.editUser(user);

		expect(data).toEqual(expected);
	});
});
