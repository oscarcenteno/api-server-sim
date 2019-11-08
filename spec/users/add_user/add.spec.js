const api = require('./api');
const user = {
	name: 'John',
	lastName: 'Smith'
};

describe('Method', () => {
	it('can match POST method and body', async () => {
		const data = await api.addUser(user);

		expect(data).toEqual({ id: 1 });
	});
});
