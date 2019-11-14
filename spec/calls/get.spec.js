const api = require('./api');
const helloApi = require('../hello/get/api');

describe('Calls', () => {
	it('can report the port', async () => {
		const port = await api.getPortFromTheCalls();
		expect(port).toEqual(3001);
	});

	it('can report calls to an endpoint', async () => {
		// given the hello endpoint was called
		await helloApi.getGetHello();

		// then the calls endpoint will contain a call to it
		const calls = await api.getCallsTo('/hello');
		expect(calls.length).toBeGreaterThan(0);
	});

	it('can report method, url, headers, body and query used for a call', async () => {
		// given the hello endpoint was called
		await helloApi.getGetHello();

		// then the calls endpoint will contain a call to it
		const call = await api.getFirstCallTo('/hello');
		const expected = getExpected();
		expect(call).toEqual(expected);
	});

});

function getExpected() {
	return {
		method: 'GET',
		url: '/hello',
		headersIsReported: true,
		bodyIsReported: true,
		queryIsReported: true
	};
}