const api = require('./api');
const user = {
	name: 'John',
	lastName: 'Smith'
};

describe('Users', () => {
	it('can add a valid user', async () => {
		const data = await api.addUser(user);

		expect(data).toEqual({ id: 1 });
	});
});
