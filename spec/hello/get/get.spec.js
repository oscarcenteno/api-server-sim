const api = require('./api');

describe('Hello', () => {
	it('can match GET method, url and return status with response', async () => {
		const users = await api.getGetHello();
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return { 'message': 'Hello World!' };
}
