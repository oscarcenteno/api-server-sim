const api = require('./api');
const helloApi = require('../hello/get/api');

describe('Calls', () => {
	it('can report the port', async () => {
		const port = await api.getPortFromTheCalls();
		expect(port).toEqual(3001);
	});

	it('can report calls to endpoints', async () => {
		// given some calls are reported
		const currentCalls = await api.getCalls();

		// when a new call is made
		await helloApi.getGetHello();

		// then the calls will have one more reported
		const calls = await api.getCalls();
		const expected = currentCalls.length + 1;
		expect(calls.length).toEqual(expected);
	});

	it('can report method, url, headers, body and query used for a call', async () => {
		// given the hello endpoint was called
		await helloApi.getGetHello();

		// then the calls endpoint will contain a call to it
		const call = await api.getLastCallTo({ method: 'GET', url: '/hello' });
		const expected = getExpected();
		expect(call).toEqual(expected);
	});

	it('can flush calls', async () => {
		// given at least one call was made
		await helloApi.getGetHello();

		// when the calls are flushed
		await api.flush();

		// then no calls will be returned
		const calls = await api.getCalls();
		expect(calls).toEqual([]);
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