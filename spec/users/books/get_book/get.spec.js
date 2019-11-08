const api = require('./api');

describe('Url', () => {
	it('urls can be as complex as required', async () => {
		const users = await api.getBookForUser({ userId: 1, bookId: 1 });
		const expected = getExpected();

		expect(users).toEqual(expected);
	});
});

function getExpected() {
	return {
		'name': 'ISTQB',
		'author': 'John Smith'
	};
}
