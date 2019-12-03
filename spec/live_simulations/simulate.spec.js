const api = require('./api');
const helloApi = require('../hello/get/api');

describe('Simulate responses on demand', () => {
	it('can add a one-time-simulation at runtime to match method and path', async () => {
		// given endpoint is configured to answer GET /hello
		await simulateGetHello();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then status will be 500
			expect(error.response.status).toEqual(500);
		}
		finally {
			await api.deleteSimulations();
		}
	});

	it('both method and path should match', async () => {
		// given endpoint is configured to answer POST /hello
		await simulatePostHello();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			// then no 500 error is thrown
		}
		finally {
			await api.deleteSimulations();
		}
	});
	it('can add a one-time-simulation at runtime to get an status code', async () => {
		// given endpoint is configured to answer GET /hello
		await simulateGetHello();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then status will be the expected one
			expect(error.response.status).toEqual(500);
		}
		finally {
			await api.deleteSimulations();
		}
	});

	it('can add a one-time-simulation at runtime to get a response', async () => {
		// given endpoint is configured to answer GET /hello
		await simulateGetHello();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then response body will be the expected one
			const expected = { message: 'server is down!' };
			expect(error.response.data).toEqual(expected);
		}
		finally {
			await api.deleteSimulations();
		}
	});
});

async function simulateGetHello() {
	const data = {
		method: 'get',
		path: '/hello',
		status: 500,
		response: { message: 'server is down!' }
	};
	await api.createSimulation(data);
}

async function simulatePostHello() {
	const data = {
		method: 'post',
		path: '/hello',
		status: 500,
		response: {}
	};
	await api.createSimulation(data);
}