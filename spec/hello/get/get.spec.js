const api = require('./api');

describe('Method', () => {
	it('can match GET method, url and return status with response', async () => {
		const users = await api.getHello();
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return { 'message': 'Hello World!' };
}
