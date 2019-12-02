const api = require('./api');
const helloApi = require('../hello/get/api');
const usersApi = require('../users/get_users/api');

describe('Calls', () => {
	it('can report the port', async () => {
		const port = await api.getPortFromTheCalls();
		expect(port).toEqual(3001);
	});

	it('sim does not record calls by default, and also after a delete', async () => {
		// given some calls are reported
		await api.deleteCalls();

		// when a new call is made
		await helloApi.getHello();

		// then the calls will have one more reported
		const calls = await api.getCalls();
		expect(calls.length).toEqual(0);
	});

	it('can report calls to endpoints', async () => {
		// given recording is started on a fresh server
		await api.deleteCalls();
		await api.startRecordingCalls();

		// when a new call is made
		await helloApi.getHello();

		// then the calls will have one more reported
		const calls = await api.getCalls();
		expect(calls.length).toEqual(1);
	});

	it('can report method, url, headers, body and query used for a call', async () => {
		// given no calls are reported
		await api.deleteCalls();
		await api.startRecordingCalls();

		// when the hello endpoint was called
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

	it('can delete calls', async () => {
		// given several calls were recorded
		await api.deleteCalls();
		await api.startRecordingCalls();
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();

		// when calls are deleted
		await api.deleteCalls();

		// then no more will be reported
		const calls = await api.getCalls();
		expect(calls.length).toEqual(0);
	});

	it('can start recording all calls until a question is made', async () => {
		// given at least one call was made
		await api.deleteCalls();
		await api.startRecordingCalls();
		await helloApi.getHello();

		// when a question is made
		await api.getCalls();

		// then no more will be recorded in next calls
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();

		const secondCalls = await api.getCalls();
		expect(secondCalls.length).toEqual(1);
	});

	it('can re-start recording calls', async () => {
		// given a questions was made
		await api.deleteCalls();
		await api.startRecordingCalls();
		await helloApi.getHello();
		await api.getCalls();

		// when the recording is restarted
		await api.startRecordingCalls();

		// then next calls will be recorded
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();

		const secondCalls = await api.getCalls();
		expect(secondCalls.length).toEqual(5);
	});

	it('can list calls by url and method', async () => {
		// given a fresh server is recording
		await api.deleteCalls();
		await api.startRecordingCalls();

		// when the hello endpoint was called 3 times
		await helloApi.getHello();
		await helloApi.getHello();
		await helloApi.getHello();

		// then there will be 3 calls
		const calls = await api.getCallsTo({ method: 'GET', url: '/hello' });
		expect(calls.length).toEqual(3);
	});

	it('can list calls by url only', async () => {
		// given a fresh server is recording
		await api.deleteCalls();
		await api.startRecordingCalls();

		// when the hello endpoint was called four times
		await api.startRecordingCalls();
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
		// given a fresh server is recording
		await api.deleteCalls();
		await api.startRecordingCalls();

		// when the POST endpoint was called two times
		await api.startRecordingCalls();
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