const api = require('./api');
const helloApi = require('../hello/get/api');
const usersApi = require('../users/get_users/api');

describe('Calls', () => {
	it('can report the port', async () => {
		const port = await api.getPortFromTheCalls();
		expect(port).toEqual(3001);
	});

	it('can report calls to endpoints', async () => {
		// given some calls are reported
		const currentCalls = await api.getCalls();

		// when a new call is made
		await helloApi.getHello();

		// then the calls will have one more reported
		const calls = await api.getCalls();
		const expected = currentCalls.length + 1;
		expect(calls.length).toEqual(expected);
	});

	it('can report method, url, headers, body and query used for a call', async () => {
		// given the hello endpoint was called
		await helloApi.getHello();

		// then the calls endpoint will contain a call to it
		const call = await api.getLastCallTo({ method: 'GET', url: '/hello' });
		const expected = getExpected();
		expect(call).toEqual(expected);
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

	it('can delete all calls', async () => {
		// given at least one call was made
		await helloApi.getHello();

		// when the calls are deleted
		await api.deleteCalls();

		// then no calls will be returned
		const calls = await api.getCalls();
		expect(calls.length).toEqual(0);
	});

	it('can list calls by url and method', async () => {
		// given the hello endpoint was called 3 times
		await api.deleteCalls();
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();

		// then there will be 3 calls
		const calls = await api.getCallsTo({ method: 'GET', url: '/hello' });
		expect(calls.length).toEqual(3);
	});

	it('can list calls by url only', async () => {
		// given the hello endpoint was called four times
		await api.deleteCalls();
		await helloApi.getHello();
		await helloApi.postHello();
		await helloApi.putHello();
		await helloApi.deleteHello();
		await usersApi.getUsers();

		// then there will be four calls
		const calls = await api.getCallsForUrl('/hello');
		expect(calls.length).toEqual(4);
	});

	it('can list calls by method only', async () => {
		// given the POST endpoint was called two times
		await api.deleteCalls();
		await helloApi.postHello();
		await helloApi.getHello();
		await helloApi.postHello();
		await helloApi.getHello();
		await usersApi.getUsers();

		// then there will be 2 calls
		const calls = await api.getCallsWithMethod('POST');
		expect(calls.length).toEqual(2);
	});

});